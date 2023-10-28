class Vbex {
  constructor(document, perems, funcs) {
    this.doc = document
    this.vbAttrs = ['vb-for', 'vb-click', 'vb-if', 'vb-model']
    this.elementsStore = {}
    this.getId = function () {
      var incrementingId = 0;
      return function(element) {
        if (!element.id) {
          element.id = "id_" + incrementingId++;
          // Possibly add a check if this ID really is unique
        }
        return element.id;
      };
    }();
    this.vbFuncs = {
      ...funcs,
      vb1(a, b) {
        console.log(a, b)
        console.log('vb1')
      },
      vb2: (a) => {
        console.log(a)
        console.log('vb2')
      },
    }
    this.workers = {
      'vb-click': this.VbClickWorker.bind(this),
      'vb-if': this.VbIfWorker.bind(this),
      'vb-model': this.VbModelWorker.bind(this),
      'vb-for': this.VbForWorker.bind(this),
    }
    this.perems = perems
    this.reactivePerems = {}
    // this.idAppElement = idAppElement
    // this.rootElement = document.getElementById(idAppElement)
    // this.components = []
  }

  initElement(element) {
    this.checkElem(element)

    const elementChildren = element.childNodes
    for (let childeNode of elementChildren) {

      if (childeNode.nodeName === '#text') {
        this.initTextNode(childeNode)
        continue;
      }

      if (childeNode.hasChildNodes) {
        this.initElement(childeNode)
        continue
      }
    }
  }

  checkElem(element) {//attrValue, attrName
    for (let attrKey of this.vbAttrs) {
      let attrValue = element.getAttribute(attrKey)

      if (attrValue) {
        this.workers[attrKey](element, attrKey)
      }
    }

  }

  VbClickWorker(element, attrKey) {
    element.addEventListener('click', () => {
      let elementAttrValue = element.getAttribute(attrKey)
      const attrs = window.VB_context[elementAttrValue]
      if (Array.isArray(attrs)) {
        this.vbFuncs[elementAttrValue](...attrs);
      } else {
        this.vbFuncs[elementAttrValue](attrs);
      }
    })
  }

  VbIfWorker(element, attrKey) {
    const elementAttrValue = element.getAttribute(attrKey)
    this.reactive(elementAttrValue, this.perems[elementAttrValue])
    const elemId = this.getId(element)

    this.elementsStore[elemId + '_' + elementAttrValue + '_prevElement'] = element?.previousSibling
    this.elementsStore[elemId + '_' + elementAttrValue + '_parent'] = element?.parentNode

    if (!this.reactivePerems[elementAttrValue]) {
      element.remove()
    }
    const callback = (newValue, oldValue) => {
      const prevElement = this.elementsStore[elemId + '_' + elementAttrValue + '_prevElement']
      const parentElement = this.elementsStore[elemId + '_' + elementAttrValue + '_parent']

      if (newValue) {
        if (prevElement) {
          prevElement.after(element)
        }
        if (!prevElement) {
          parentElement.prepend(element)
        }
      } else {
        element.remove()
      }
    }

    this.reactivePerems[elementAttrValue + '_callbacks'][elemId] = callback
  }

  VbModelWorker(element, attrKey) {
    const elementAttrValue = element.getAttribute(attrKey)
    this.reactive(elementAttrValue, this.perems[elementAttrValue])
    element.value = this.perems[elementAttrValue]
    const callback = (newValue, oldValue) => {
      element.value = newValue
    }

    const elemId = this.getId(element) 
    this.reactivePerems[elementAttrValue + '_callbacks'][elemId] = callback
    element.addEventListener('change', (el) => {
      this.reactivePerems[elementAttrValue] = el.target.value
    })
  }

  VbForWorker(element, attrKey) {
    console.log(this.perems)
    console.log(this.reactivePerems)
    const elementAttrValue = element.getAttribute(attrKey)
    const argsVbFor = elementAttrValue.split(' ')
    const items = this.perems[argsVbFor[2]]
    const nameItem = argsVbFor[0]
    if (!items) {
      throw new Error(`perem ${argsVbFor[2]} is undefined`);
    }
    if (argsVbFor.length < 3) {
      console.error('vb-for error in element', element)
      throw new Error('vb-for is incorrect');
    }

    this.reactive(argsVbFor[2], this.perems[argsVbFor[2]])
    element.removeAttribute("vb-for")
    let prevElement = element?.previousSibling
    const parentElement = element?.parentNode

    
    const elemId = this.getId(element)
    this.elementsStore[elemId + '_' + elementAttrValue + '_prevElement'] = element?.previousSibling
    this.elementsStore[elemId + '_' + elementAttrValue + '_parent'] = element?.parentNode
    element.removeAttribute('id')
    let elementsVbFor = []
    for(let item of items) {
      const clonedElement = element.cloneNode(true)
      const elemId = this.getId(clonedElement)
      elementsVbFor.push(clonedElement)

      if (prevElement) {
        prevElement.after(clonedElement)
        prevElement = clonedElement
      }
      if (!prevElement) {
        parentElement.prepend(clonedElement)
        prevElement = clonedElement
      }
      
      this.deepSearcher(clonedElement, this.initTextNode, [nameItem, item], '#text')
      this.initElement(clonedElement)
    }
    const clonedOriginalElement = element.cloneNode(true)
    element.remove()

    const callback = (newValue, oldValue) => {
      let newPrevElement = this.elementsStore[elemId + '_' + elementAttrValue + '_prevElement']
      const newParentElement = this.elementsStore[elemId + '_' + elementAttrValue + '_parent']

      for(let el of elementsVbFor) {
        this.deepSearcher(el, this.removeElementCallbacks, [el])
        el.remove()
      }

      for(let item of newValue) {
        const clonedElement = clonedOriginalElement.cloneNode(true)
        const elemId = this.getId(clonedElement)
        elementsVbFor.push(clonedElement)
        

        if (newPrevElement) {
          newPrevElement.after(clonedElement)
          newPrevElement = clonedElement
        }
        if (!newPrevElement) {
          newParentElement.prepend(clonedElement)
          newPrevElement = clonedElement
        }

        
        this.deepSearcher(clonedElement, this.initTextNode, [nameItem, item], '#text')
        this.initElement(clonedElement)
      }
    }

    this.reactivePerems[argsVbFor[2] + '_callbacks'][elemId] = callback
  }

  removeElementCallbacks(el) {
    for(let reactivePeremPart of Object.entries(this.reactivePerems)){
      if (reactivePeremPart[0].includes('_callbacks')) {
        let callbacks = reactivePeremPart[1]
        // delete this.reactivePerems[reactivePeremPart[0]][callbacks[el.id]]
        
        for(let callbackId of Object.keys(callbacks)){
          if (callbackId == el.id) {
            delete this.reactivePerems[reactivePeremPart[0]][callbackId]
          }
        }
      }
    }
  }

  deepSearcher(element, fn, args, nodeName){
    fn = fn.bind(this)
    if (nodeName) {
      
      if (element.nodeName === nodeName) {
        fn(element, ...args)
      }

      const elementChildren = element.childNodes

      for(let childNode of elementChildren){
        if (childNode.nodeName === nodeName) {
          fn(childNode, ...args)
        }

        this.deepSearcher(childNode, fn, args, nodeName)
      }
    } else {

      fn(element)
      const elementChildren = element.childNodes
      for(let childNode of elementChildren){
        fn(childNode)
        this.deepSearcher(childNode, fn, args)
      }
    }
    
  }

  initTextNode(element, ownPeremName, ownPeremValue) {
    let textData = element.data
    let startIndex = textData.indexOf('{{')
    let endIndex = textData.indexOf('}}')
    if(startIndex === -1 || endIndex === -1) return
    const peremsMap = {}
    let offset = 0

    while (startIndex !== -1 || endIndex !== -1) {
      let perem = textData.slice(startIndex + 2, endIndex)
      perem = perem.trim()
      peremsMap[perem] = {
        startIndex: startIndex + offset,
        endIndex: endIndex + offset + 1,
      }

      textData = textData.slice(endIndex + 2)
      startIndex = textData.indexOf('{{')//нету throw на случай "{{ }} {{" 
      endIndex = textData.indexOf('}}')
      offset = endIndex
    }

    const elemId = this.getId(element.parentNode)

    for(let entrie of Object.entries(peremsMap)) {
      const key = entrie[0]
      const value = entrie[1]

      let existPerem = undefined

      if (existPerem = this.perems[key]) {
        this.reactive(key, this.perems[key])
        const regex = /{{(.*?)}}/g;
        const re = new RegExp(`{{(${key})}}`);
        element.data = element.data.replace(re, this.perems[key])
        
        let callback = (newValue, oldValue) => {
          element.data = element.data.replace(oldValue, newValue)
        }

        
        this.reactivePerems[key + '_callbacks'][elemId] = (callback)
      }
      
      
      if (ownPeremName && key === ownPeremName) {
        const re = new RegExp(`{{(${key})}}`);
        element.data = element.data.replace(re, ownPeremValue)
      }
    }
  }

  reactive(varName, varValue) {
    const context = this.reactivePerems
    if (Object.keys(context).includes(varName)) return

    const newObj = Object.defineProperties(context, {
      [varName]: {
        get: function () {
          return context[varName + '_value'];
        },
        set: function (value) {
          const oldValue = context[varName + '_value']
          context[varName + '_value'] = value;

          for (const callback of Object.values(context[varName + '_callbacks'])) {
            callback(context[varName + '_value'], oldValue, varName)
          }
        },
        enumerable: true,
        configurable: true
      },
      [varName + '_value']: {
        value: varValue,
        enumerable: false,
        configurable: true,
        writable: true
      },
      [varName + '_callbacks']: {
        value: {},
        enumerable: true,
        configurable: true,
        writable: true
      }
    });
    return newObj
  }

  recursiveDo(element) {

  }


  // mount(){
  //   for (let component of this.components) {
  //     const newDiv = document.createElement("div");
  //     newDiv.setAttribute('id', component.name)
  //     this.rootElement.append(newDiv)
  //     newDiv.innerHTML = component.template
  //     console.log(newDiv.getAttribute('x-click'))
  //   }

  // }
}

// class Component {
//   constructor(data, methods, template) {
//     this.data = data
//     this.methods = methods
//     this.template = template
//   }

//   createComponent(data) {
//     let componentData = {
//       componentName: "standart name",
//       template: 'Стандарт темплейт',
//       data: {},
//       methods: {
//         ded() {
//           console.log('ded')
//         }
//       }
//     }
//     Object.assign(componentData, data);
//     this.components.push(componentData)
//   }
// }
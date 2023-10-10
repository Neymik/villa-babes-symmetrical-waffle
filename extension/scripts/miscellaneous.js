
function VB_removeElements (group) {

  if (!VB_context[group]) {
    return
  }

  for (const elemName in VB_context[group]) {
    const elem = VB_context[group][elemName];
    elem.remove();
    VB_context[group][elemName] = undefined;
  }

  VB_context[group] = undefined;

}

function VB_getElement ({ name, type, context, group, onCreateCallback = (elem)=>{} }) {

  let elemBase = VB_context;

  if (group) {
    if (!VB_context[group]) {
      VB_context[group] = {};
    }

    elemBase = VB_context[group];
  }

  const elemId = 'VB_' + name + type;

  // if (context) {
  //   elem = context.querySelector(elemId);
  // } else {
    
  // }

  elem = document.getElementById(elemId);

  if (elem) { // fix me im dumb
    if (elemBase[name]) {
      elemBase[name].remove();
    }
  }

  elem = document.createElement(type);
  elem.id = 'VB_' + name + type;
  elemBase[name] = elem

  context.appendChild(elem);

  onCreateCallback(elem);

  return elem
}

async function VB_llmRequestSend ({messageText, messageXno, taskId, directPrompt, promptOnly}) {

  const startDate = new Date();
  window.VB_context.llmRequestSendLoading = true;
  window.VB_context.llmRequestSendLoadingStartDate = startDate;

  if (!window.VB_sellerToolOpened) {
    VB_opensellerTool()
    window.VB_sellerToolOpened = true;
  }

  for (const inputForm of document.querySelectorAll('.VB_inputModal')) {
    inputForm.setAttribute('disabled', true);
    inputForm.classList.add('VB_disabled');
  }

  window.VB_context.lastTaskId = taskId;

  const userName = VB_context.userName;

  const requestBody = {
    messagesArray: VB_context.messages,
    requestString: messageText,
    taskId: taskId,
    directPrompt: directPrompt,
    userName: userName,
    promptOnly,
    messageXno
  }

  console.log(requestBody)
  let responseData = {}

  const triesMax = 3;
  for (let tryNo = 0; tryNo < 3; tryNo++) {

    try {
      const response = await fetch(VB_context.VB_REQUEST_URL, {
        method: "POST",
        cors: "no-cors",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": VB_context.VB_ACCESS_TOKEN,
        },
        body: JSON.stringify(requestBody),
      });
    
      responseData = await response.json();
      break

    } catch (error) {

      console.log({error})

      if (VB_context.sellerToolModal?.modalDuration) {
        VB_context.sellerToolModal.modalDuration.innerHTML = 'Request failed. Retrying... ' + tryNo + '/' + triesMax;
      }
      await new Promise(r => setTimeout(r, 1000));
    }

  }

  console.log(responseData)

  if (!responseData) {
    if (VB_context.sellerToolModal?.modalDuration) {
      VB_context.sellerToolModal.modalDuration.innerHTML = 'Request failed, try again later :(';
    }
  }

  if (VB_context.sellerToolModal?.modalInput_result) {
    VB_context.sellerToolModal.modalInput_result.value = responseData.result;
    VB_context.modalInputValue_result = responseData.result;
  }
  if (VB_context.sellerToolModal?.modalInput_prompt) {
    VB_context.sellerToolModal.modalInput_prompt.value = responseData.prompt;
    VB_context.modalInputValue_prompt = responseData.prompt;
  }

  // VB_context.chatBlock?.requestOutput?.value = responseData.result;  


  const endDate = new Date();
  const duration = endDate - startDate;

  window.VB_context.lastResponseDuration = duration;

  if (VB_context.sellerToolModal?.modalDuration) {
    VB_context.sellerToolModal.modalDuration.innerHTML = 'Duration: ' + window.VB_context.lastResponseDuration + 'ms';;
  }

  console.log({startDate, endDate, duration})
  window.VB_context.llmRequestSendLoadingEndDate = endDate;
  window.VB_context.llmRequestSendLoading = false;

  for (const inputForm of document.querySelectorAll('.VB_inputModal')) {
    inputForm.removeAttribute('disabled');
    inputForm.classList.remove('VB_disabled');
  }

  return responseData

}



async function loadButtonsToRender () {

  try {
    const response = await fetch(window.VB_context.VB_BASE_URL + 'feRenders', {
      method: "GET",
      cors: "no-cors",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": window.VB_context.VB_ACCESS_TOKEN,
      },
    });

    const buttonsToRender = await response.json();

    buttonsToRender.sort((a, b) => {
      if (!a.renderData.priority) {
        a.renderData.priority = 0;
      }
      if (!b.priority) {
        b.renderData.priority = 0;
      }
      if (a.renderData.priority > b.renderData.priority) {
        return 1
      }
      if (a.renderData.priority < b.renderData.priority) {
        return -1
      }
      return 0
    })

    window.VB_context.buttonsToRender = buttonsToRender;
    console.log(window.VB_context.buttonsToRender)
  } catch (error) {
    console.log({error})
    return
  }

}


window.VB_scriptsLoaded1 = true;

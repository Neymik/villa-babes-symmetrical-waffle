
function VB_devToolInit () {

  const navBar = document.querySelector('.l-header__menu');

  const openModalButton = VB_getElement({name: 'openModalButton', type: 'a', context: navBar, group: 'devTool'});
  openModalButton.classList.add(...'l-header__menu__item m-size-lg-hover m-with-round-hover m-width-fluid-hover'.split(' '));
  openModalButton.innerHTML = `Villa Babes`;

  const icon = VB_getElement({name: 'icon', type: 'img', context: openModalButton, group: 'devTool'});
  icon.src = chrome.runtime.getURL("villa-babes-logo.png");

  window.VB_devToolOpened = false;
  openModalButton.addEventListener('click', VB_devToolClick);

}

function VB_devToolClick () {

  window.VB_devToolOpened = !window.VB_devToolOpened

  if (window.VB_devToolOpened) {
    VB_openDevTool()
  } else {
    VB_closeDevTool()
  }
}

function VB_closeDevTool () {
  VB_removeElements('devToolModal');
}

function VB_openDevTool () {

  const documentBody = document.querySelector('body');

  const modal = VB_getElement({name: 'modal', type: 'div', context: documentBody, group: 'devToolModal'});
  modal.classList.add('VB_modal');

  const modalInputs = {
    // 'modelContext': {},
    // 'dialogue': {},
    // 'memberFacts': {},
    // 'dialogueStyle': {},
    // 'taskPrompt': {},
    // 'promptTemplate': {},
    'prompt': {},
    'result': {},
  }

  for (const inputKey in modalInputs) {
    const input = VB_getElement({name: 'modalInput_' + inputKey, type: 'textarea', context: modal, group: 'devToolModal'});
    input.classList.add('VB_inputModal');
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', inputKey);
    modalInputs[inputKey] = input;
  }


  const modalButtons = VB_getElement({name: 'modalButtons', type: 'div', context: modal, group: 'devToolModal'});


  const modalButtonClose = VB_getElement({name: 'modalButtonClose', type: 'button', context: modalButtons, group: 'devToolModal'});
  modalButtonClose.classList.add('VB_modalButtonClose');
  modalButtonClose.innerHTML = 'Close';
  modalButtonClose.addEventListener('click', VB_devToolClick);

  const modalButtonCopy = VB_getElement({name: 'modalButtonCopy', type: 'button', context: modalButtons, group: 'devToolModal'});
  modalButtonCopy.classList.add('VB_modalButton');
  modalButtonCopy.innerHTML = 'CopyPrompt';
  modalButtonCopy.addEventListener('click', () => {
    navigator.clipboard.writeText(modalInputs['prompt'].value);
  });

  const modalButtonReset = VB_getElement({name: 'modalButtonReset', type: 'button', context: modalButtons, group: 'devToolModal'});
  modalButtonReset.classList.add('VB_modalButton');
  modalButtonReset.innerHTML = 'Reset';
  modalButtonReset.addEventListener('click', () => VB_llmRequestSend());


  const modalButtonGenerate = VB_getElement({name: 'modalButtonGenerate', type: 'button', context: modalButtons, group: 'devToolModal'});
  modalButtonGenerate.classList.add('VB_modalButtonAccent');
  modalButtonGenerate.innerHTML = 'Generate';
  modalButtonGenerate.addEventListener('click', () => VB_llmRequestSend({
    directPrompt: modalInputs['prompt'].value,
  }));


}

window.VB_scriptsLoaded2 = true;

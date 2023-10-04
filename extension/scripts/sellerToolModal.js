
try {
  promptMode = localStorage.getItem('promptMode') == 'true' ? true : false;
} catch (error) {
  promptMode = false;
}


function VB_sellerToolInit () {

  const navBar = document.querySelector('.l-header__menu');

  const openModalButton = VB_getElement({name: 'openModalButton', type: 'a', context: navBar, group: 'sellerTool'});
  openModalButton.classList.add(...'VB_navBarButton l-header__menu__item m-size-lg-hover m-with-round-hover m-width-fluid-hover'.split(' '));
  openModalButton.innerHTML = `Villa Talk`;

  // const icon = VB_getElement({name: 'icon', type: 'img', context: openModalButton, group: 'sellerTool'});
  // icon.src = chrome.runtime.getURL("villa-babes-logo.png");

  window.VB_sellerToolOpened = false;
  openModalButton.addEventListener('click', VB_sellerToolClick);

}

function VB_sellerToolClick () {

  window.VB_sellerToolOpened = !window.VB_sellerToolOpened

  if (window.VB_sellerToolOpened) {
    VB_opensellerTool()
  } else {
    VB_closesellerTool()
  }
}

function VB_closesellerTool () {
  VB_removeElements('sellerToolModal');
}

function VB_opensellerTool () {

  const documentBody = document.querySelector('body');

  const modal = VB_getElement({name: 'modal', type: 'div', context: documentBody, group: 'sellerToolModal'});
  modal.classList.add('VB_modal');

  let inputPrompt = undefined;
  let modalResults = undefined;

  if (promptMode) {
    
    inputPrompt = VB_getElement({name: 'modalInput_prompt', type: 'textarea', context: modal, group: 'sellerToolModal'});
    inputPrompt.classList.add('VB_inputModal');
    inputPrompt.setAttribute('type', 'text');
    inputPrompt.setAttribute('placeholder', 'prompt');

    inputPrompt.addEventListener('input', (value) => {
      window.VB_context['modalInputValue_prompt'] = value.target.value;
    });

    if (window.VB_context['modalInputValue_prompt']) {
      inputPrompt.value = window.VB_context['modalInputValue_prompt'];
    }


    modalResults = VB_getElement({name: 'modalResults', type: 'div', context: documentBody, group: 'sellerToolModal'});
    modalResults.classList.add('VB_modalResult');

  }

  const inputResult = VB_getElement({name: 'modalInput_result', type: 'textarea', context: modalResults ? modalResults: modal, group: 'sellerToolModal'});
  inputResult.classList.add('VB_inputModal');
  inputResult.setAttribute('type', 'text');
  inputResult.setAttribute('placeholder', 'result');

  inputResult.addEventListener('input', (value) => {
    window.VB_context['modalInputValue_result'] = value.target.value;
  });

  if (window.VB_context['modalInputValue_result']) {
    inputResult.value = window.VB_context['modalInputValue_result'];
  }


  const modalDuration = VB_getElement({name: 'modalDuration', type: 'div', context: modal, group: 'sellerToolModal'});
  modalDuration.innerHTML = 'Duration: ' + window.VB_context.lastResponseDuration + 'ms';

  const modalButtons = VB_getElement({name: 'modalButtons', type: 'div', context: modal, group: 'sellerToolModal'});


  const modalButtonClose = VB_getElement({name: 'modalButtonClose', type: 'button', context: modalButtons, group: 'sellerToolModal'});
  modalButtonClose.classList.add('VB_modalButtonClose');
  modalButtonClose.innerHTML = 'Close';
  modalButtonClose.addEventListener('click', VB_sellerToolClick);


  // const modalButtonReset = VB_getElement({name: 'modalButtonReset', type: 'button', context: modalButtons, group: 'sellerToolModal'});
  // modalButtonReset.classList.add('VB_modalButton');
  // modalButtonReset.innerHTML = 'Reset';
  // modalButtonReset.addEventListener('click', () => VB_llmRequestSend({
  //   promptOnly: true,
  // }));


  const modalButtonGenerate = VB_getElement({name: 'modalButtonGenerate', type: 'button', context: modalButtons, group: 'sellerToolModal'});
  modalButtonGenerate.classList.add('VB_modalButtonAccent');
  modalButtonGenerate.innerHTML = 'Regenerate';
  modalButtonGenerate.addEventListener('click', () => {
    let directPrompt = undefined;
    if (inputPrompt) {
      directPrompt = inputPrompt?.value
    }
    VB_llmRequestSend({
      promptTaskType: window.VB_context.lastPromptTaskType,
      directPrompt: directPrompt,
    });
  });


}

window.VB_scriptsLoaded2 = true;

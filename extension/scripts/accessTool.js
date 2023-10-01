
function VB_accessInit () {

  const navBar = document.querySelector('.l-header__menu');

  const openModalButton = VB_getElement({name: 'openModalButton', type: 'a', context: navBar, group: 'access'});
  openModalButton.classList.add(...'l-header__menu__item m-size-lg-hover m-with-round-hover m-width-fluid-hover'.split(' '));
  openModalButton.innerHTML = `Villa Babes Access`;

  const icon = VB_getElement({name: 'icon', type: 'img', context: openModalButton, group: 'access'});
  icon.src = chrome.runtime.getURL("villa-babes-logo.png");

  window.VB_accessModalOpened = false;
  openModalButton.addEventListener('click', VB_accessClick);

  if (window.VB_context['VB_ACCESS_TOKEN']) {
    VB_accessLogin ();
  }

}


function VB_accessClick () {

  window.VB_accessModalOpened = !window.VB_accessModalOpened

  if (window.VB_accessModalOpened) {
    VB_openAccessModal()
  } else {
    VB_closeAccessModal()
  }
}

function VB_closeAccessModal () {
  VB_removeElements('accessModal');
}


function VB_openAccessModal () {

  const documentBody = document.querySelector('body');

  const modal = VB_getElement({name: 'modal', type: 'div', context: documentBody, group: 'accessModal'});
  modal.classList.add('VB_modal');


  const inputCode = VB_getElement({name: 'modalInput_code', type: 'input', context: modal, group: 'accessModal'});
  inputCode.setAttribute('placeholder', 'access code');

  inputCode.addEventListener('input', (value) => {
    window.VB_context['VB_ACCESS_TOKEN'] = value.target.value;
    localStorage.setItem('VB_ACCESS_TOKEN', window.VB_context['VB_ACCESS_TOKEN']);
  });

  if (window.VB_context['VB_ACCESS_TOKEN']) {
    inputCode.value = window.VB_context['VB_ACCESS_TOKEN'];
  }

  const loginButton = VB_getElement({name: 'loginButton', type: 'button', context: modal, group: 'accessModal'});
  loginButton.classList.add('VB_modalButtonClose');
  loginButton.innerHTML = 'Login';
  loginButton.addEventListener('click', VB_accessLogin);

  const quitButton = VB_getElement({name: 'quitButton', type: 'button', context: modal, group: 'accessModal'});
  quitButton.classList.add('VB_modalButtonClose');
  quitButton.innerHTML = 'Quit';
  quitButton.addEventListener('click', VB_accessQuit);

  const modalButtonClose = VB_getElement({name: 'modalButtonClose', type: 'button', context: modal, group: 'accessModal'});
  modalButtonClose.classList.add('VB_modalButtonClose');
  modalButtonClose.innerHTML = 'Close';
  modalButtonClose.addEventListener('click', VB_accessClick);

  const loginStatus = VB_getElement({name: 'loginStatus', type: 'div', context: modal, group: 'accessModal'});
  loginStatus.classList.add('VB_loginStatus');
  loginStatus.innerHTML = 'Not logged in';

}

async function VB_accessLogin () {

  try {
    const response = await fetch(window.VB_context.VB_BASE_URL, {
      method: "GET",
      cors: "no-cors",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": window.VB_context.VB_ACCESS_TOKEN,
      }
    });
  
    responseData = await response.json();

    window.VB_context.VB_accessInited = true;

    if (window.VB_context?.accessModal?.loginStatus) {
      window.VB_context.accessModal.loginStatus.innerHTML = 'Logged in';
    }
    
  } catch (error) {
    window.VB_context.accessModal.loginStatus.innerHTML = 'Login failed';
    console.log({error})
    return
  }

  VB_init();

}

function VB_accessQuit () {
  localStorage.setItem('VB_ACCESS_TOKEN', '');
  location.reload();
}


window.VB_scriptsLoaded3 = true;

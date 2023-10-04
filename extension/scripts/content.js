
try {
  devMode = localStorage.getItem('devMode') == 'true' ? true : false;
} catch (error) {
  devMode = false;
}

VB_context = {}
VB_context.VB_BASE_URL = devMode ? 'http://localhost:3001/' : 'https://api.villababes.com/';
VB_context.VB_REQUEST_URL = VB_context.VB_BASE_URL + 'promptRequestBase';
VB_context.VB_ACCESS_TOKEN = '' // sellerSecret1

try {
  VB_context.VB_ACCESS_TOKEN = localStorage.getItem('VB_ACCESS_TOKEN');
} catch (error) {
  VB_context.VB_ACCESS_TOKEN = '';
}

window.VB_context = VB_context;


async function VB_init () {

  VB_context.chatBlock = document.querySelector('.m-chat-footer');

  if (!VB_context.chatBlock || !window.VB_scriptsLoaded1 || !window.VB_scriptsLoaded2 || !window.VB_scriptsLoaded3) {
    setTimeout(VB_init, 1000);
    return
  }

  if (!window.VB_context.VB_ACCESS_TOKEN || !window.VB_context.VB_accessInited) {
    VB_accessInit();
    return
  }

  VB_sellerToolInit();

  await loadButtonsToRender();

  if (!window.VB_context.buttonsToRender) {
    setTimeout(VB_init, 1000);
    return
  }

  setInterval(regularWorker, 2000);

}

function VB_rerenderEmojiReactions () { // and scrapMessages

  // VB_removeElements('messagesBlock')

  const messagesNodes = document.querySelectorAll('.b-chat__message');

  let messageNo = 0;
  let messages = [];
  for (const messagesNode of messagesNodes) {
    const textBlocks = messagesNode.querySelectorAll('.b-chat__message__text-wrapper')
    const textBlock = textBlocks?.[textBlocks.length - 1]

    if (!textBlock) {
      continue
    }

    const sender = messagesNode.className.includes('m-from-me') ? 'Creator' : 'Member';
    const emojiHolderContext = messagesNode.querySelector('.b-chat__message__body')
    const messageText = textBlock.innerText

    messageNo += 1;
    messages.push({
      messageNo: messageNo,
      sender: sender,
      text: textBlock.innerText
    });

    if (!textBlock || !emojiHolderContext) {
      continue
    }

    const emojiHolder = VB_getElement({name: 'emojiHolder' + messageNo, type: 'div', context: emojiHolderContext, group: 'messagesBlock'})
    emojiHolder.classList.add('VB_emojiHolder');

    for (const emoji of window.VB_context.buttonsToRender) {

      if ((emoji.renderData.type != 'reaction') ||
        (sender == 'Creator' && !emoji.renderData.forCreatorMessage) ||
        (emoji.renderData.forCreatorMessage && sender != 'Creator') ||
        (emoji.renderData.forQuestionMessage == true && !messageText.includes('?')) || 
        (emoji.renderData.forQuestionMessage == false && messageText.includes('?'))
      ) {
        continue
      }

      const thisMessageNo = messageNo;
      const elemName = 'VB_Button' + messageNo + emoji.key;
      const emojiButton = VB_getElement({name: elemName, type: 'button', context: emojiHolder, group: 'messagesBlock'}) 
      emojiButton.classList.add('VB_emojiButton');
      emojiButton.innerHTML = emoji.renderData.label;
      emojiButton.addEventListener('click', () => {
        VB_llmRequestSend({
          messageText: messageText,
          messageXno: thisMessageNo,
          promptTaskType: emoji.key
        })
      });

    }

  }

  // save only last 20 messages
  messages = messages.slice(-20);

  VB_context.messages = messages;

}


function VB_rerenderBaseInterface() {

  VB_context.chatBlock = document.querySelector('.m-chat-footer');

  if (!VB_context.chatBlock) {
    return
  }

  let chatBlockHolder = document.querySelector('.VB_chatBlockHolder');

  if (chatBlockHolder) {
    return
  }

  const chatHeader = document.querySelector('.b-chat__header');
  if (chatHeader) {
    VB_context.userName = chatHeader.querySelector('.g-user-realname')?.innerText;
    if (!VB_context.userName) {
      VB_context.userName = chatHeader.querySelector('.g-user-name')?.innerText;
    }
  }

  chatBlockHolder = VB_getElement({name: 'chatBlockHolder', type: 'div', context: VB_context.chatBlock, group: 'chatBlock'})
  chatBlockHolder.classList.add('VB_chatBlockHolder');

  for (const baseButton of window.VB_context.buttonsToRender) {

    if (baseButton.renderData.type != 'button') {
      continue
    }

    const button = VB_getElement({name: 'requestButton' + baseButton.key, type: 'button', context: chatBlockHolder, group: 'chatBlock',
      onCreateCallback: (elem) => {
        elem.classList.add('VB_requestButton');
        elem.style['border-color'] = baseButton.renderData.color;
        elem.innerHTML = `&nbsp; ${baseButton.renderData.label} &nbsp;`;
      }
    });
    button.addEventListener('click', () => VB_llmRequestSend({
      promptTaskType: baseButton.key
    }));
  }

}


function VB_SellerToolWorker() {

  const fakeLoadApproxMin = 10000;
  const fakeLoadApproxMax = 20000;
  const fakeLoadApprox = Math.random() * (fakeLoadApproxMax - fakeLoadApproxMin) + fakeLoadApproxMin;

  if (window.VB_context.llmRequestSendLoading && window.VB_context?.sellerToolModal?.modal) {

    const loadingSpinner = VB_getElement({name: 'loadingSpinner', type: 'div', context: window.VB_context.sellerToolModal.modal, group: 'loadingSpinner'});
    loadingSpinner.classList.add('VB_loadingSpinner');
    loadingSpinner.innerHTML = `
    <div class="ispinner gray animating">
      <div class="ispinner-blade"></div>
      <div class="ispinner-blade"></div>
      <div class="ispinner-blade"></div>
      <div class="ispinner-blade"></div>
      <div class="ispinner-blade"></div>
      <div class="ispinner-blade"></div>
      <div class="ispinner-blade"></div>
      <div class="ispinner-blade"></div>
      <div class="ispinner-blade"></div>
      <div class="ispinner-blade"></div>
      <div class="ispinner-blade"></div>
      <div class="ispinner-blade"></div>
    </div>`;

    const loadingSpinnerText = VB_getElement({name: 'loadingSpinnerText', type: 'div', context: window.VB_context.sellerToolModal.modal, group: 'loadingSpinner'});
    loadingSpinnerText.classList.add('VB_loadingSpinnerText');
    const loading = new Date() - window.VB_context.llmRequestSendLoadingStartDate;
    loadingSpinnerText.innerHTML = (''+(loading/fakeLoadApprox)*100).slice(0, 5)+'%';

  } else {
    VB_removeElements('loadingSpinner');
  }

}


function regularWorker () {
  VB_rerenderBaseInterface();
  VB_rerenderEmojiReactions();
  VB_SellerToolWorker();
}


VB_init(); // Base method

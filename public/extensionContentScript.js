
VB_context = {
  VB_REQUEST_URL: 'http://localhost:3000/api/v0/chatgpt',
  VB_ACCESS_TOKEN: 'sellerSecret1'
}

window.VB_context = VB_context;

VB_emojisToRender = [
  {
    type: 'empathyCurious',
    description: 'Empathy + Curious',
    value: '💬',
  },
  {
    type: 'jokeFun',
    description: 'Joke + Fun',
    value: '😁',
  },
  {
    type: 'agreeThinkso',
    description: 'Agree / Think So',
    value: '👍',
  },
  {
    type: 'questionIntresting',
    description: 'Question + Wow / Intresting',
    value: '❓',
  },
  {
    type: 'understandTough',
    description: 'Understand you it’s tough',
    value: '🥺',
  },
  {
    type: 'flirtyCutie',
    description: 'Flirty / Cutie',
    value: '😏',
  },
]


function VB_init () {

  VB_context.chatBlock = document.querySelector('.m-chat-footer');

  if (!VB_context.chatBlock) {
    setTimeout(VB_init, 1000);
    return
  }

  const requestButton = VB_getElement('requestButton', 'button', 'chatBlock', 'chatBlock');
  const requestOutput = VB_getElement('requestOutput', 'input', 'chatBlock', 'chatBlock');

  requestButton.innerHTML = 'Next';
  requestButton.addEventListener('click', VB_llmRequestSend);

  requestOutput.setAttribute('placeholder', 'requestOutput');
  VB_context.chatBlock.requestOutput = requestOutput;


  setInterval(regularWorker, 1000);

}

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

function VB_getElement (name, type, group = '', append = '') {

  let elemBase = VB_context;

  if (group) {
    if (!VB_context[group]) {
      VB_context[group] = {};
    }

    elemBase = VB_context[group];
  }

  let elem = elemBase[name];
  if (elem) {
    return elem
  }

  const elemId = 'VB_' + name + type;

  elem = document.getElementById(elemId);
  if (elem) {
    elemBase[name] = elem;
    return elem
  }

  elem = document.createElement(type);
  elem.id = 'VB_' + name + type;
  elemBase[name] = elem

  if (append) {
    VB_context[append].appendChild(elem);
  }

  return elem
}


function VB_scrapMessages () {
  const messages = [];

  for (const messageBlock of document.querySelectorAll('.b-chat__message')) {
    const textBlock = messageBlock.querySelector('.b-chat__message__text-wrapper')
    sender = messageBlock.className.includes('m-from-me') ? 'Creator' : 'Member';
    messages.push({
      sender: sender,
      text: textBlock.innerText
    });
  }

  VB_context.messages = messages;

  return messages

}


async function VB_llmRequestSend ({messageText, emojiType}) {

  console.log({messageText, emojiType})

  const requestType = emojiType || 'default';

  const requestBody = {
    messagesArray: VB_context.messages,
    requestString: messageText,
    requestType: requestType
  }

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

  console.log(responseData)

  VB_context.chatBlock.requestOutput.value = responseData.result;

  return responseData

}

function VB_rerenderEmojiReactions () {

  VB_removeElements('messagesBlock')

  const messagesNodes = document.querySelectorAll('.b-chat__message');

  let messageNo = 0;
  for (const messagesNode of messagesNodes) {
    messageNo += 1;
    const messageTextNode = messagesNode.querySelector('.b-chat__message__body')
    const emojiHolder = VB_getElement('emojiHolder' + messageNo, 'div', 'messagesBlock')
    emojiHolder.classList.add('emojiHolder');
    messageTextNode.appendChild(emojiHolder);

    const messageText = messageTextNode.querySelector('.b-chat__message__text-wrapper')?.innerText

    for (const emoji of VB_emojisToRender) {
      const elemName = 'VB_Button' + messageNo + emoji.type;
      const emojiButton = VB_getElement(elemName, 'button', 'messagesBlock') 
      emojiButton.innerHTML = emoji.value;
      emojiButton.addEventListener('click', () => {
        VB_llmRequestSend({
          messageText: messageText,
          emojiType: emoji.type
        })
      });
      emojiHolder.appendChild(emojiButton);
    }

  }

}


function regularWorker () {
  VB_scrapMessages();
  VB_rerenderEmojiReactions();
}


VB_init();

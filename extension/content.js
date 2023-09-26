
// contentLoad = async () => {

//   BASE_URL = "https://api.villababes.com";
//   SCRIPT_URL_CONTENT = BASE_URL + "/static/extensionContentScript.js";

//   let VB_scriptContent = document.querySelector("VB_scriptContent");

//   if (VB_scriptContent) {
//     VB_scriptContent.remove();
//   }

//   VB_scriptContent = document.createElement("script");
//   VB_scriptContent.id = "VB_scriptContent";
//   // VB_scriptContent.src = SCRIPT_URL_CONTENT;

//   scriptSrc = await fetch({
//     method: "GET",
//     cors: "no-cors",
//     url: SCRIPT_URL_CONTENT,
//   });
//   scriptSrcText = await scriptSrc.text()

//   VB_scriptContent.innerHTML = scriptSrcText

//   document.body.appendChild(VB_scriptContent);

//   VB_init(); // Base method from SCRIPT_URL_CONTENT
//   VB_initContent(); 
// }


// VB_initContent = () => {
//   VB_context.chatBlock = document.querySelector('.m-chat-footer');

//   console.log('1')

//   if (!VB_context.chatBlock) {
//     setTimeout(VB_init, 1000); // Base method from SCRIPT_URL_CONTENT
//     return
//   }
// }

// contentLoad();




VB_context = {
  VB_REQUEST_URL: 'https://api.villababes.com/api/v0/chatgpt',
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
  // {
  //   type: 'questionIntresting',
  //   description: 'Question + Wow / Intresting',
  //   value: '❓',
  // },
  // {
  //   type: 'understandTough',
  //   description: 'Understand you it’s tough',
  //   value: '🥺',
  // },
  // {
  //   type: 'flirtyCutie',
  //   description: 'Flirty / Cutie',
  //   value: '😏',
  // },
]


function VB_init () {

  VB_context.chatBlock = document.querySelector('.m-chat-footer');

  if (!VB_context.chatBlock) {
    setTimeout(VB_init, 1000);
    return
  }

  const chatHeader = document.querySelector('.b-chat__header');
  if (chatHeader) {
    VB_context.userName = chatHeader.querySelector('.g-user-realname')?.innerText;
    if (!VB_context.userName) {
      VB_context.userName = chatHeader.querySelector('.g-user-name')?.innerText;
    }
  }

  const chatBlockHolder = VB_getElement({name: 'chatBlockHolder', type: 'div', context: VB_context.chatBlock, group: 'chatBlock'})
  chatBlockHolder.classList.add('VB_chatBlockHolder');

  const baseButtons = [
    'Next',
    'S1', 'S2', 'S3', 'S4', 'S5',
    'C1', 'C2', 'C3', 'C4', 'C5'
  ]

  for (const baseButton of baseButtons) {
    const button = VB_getElement({name: 'requestButton' + baseButton, type: 'button', context: chatBlockHolder, group: 'chatBlock',
      onCreateCallback: (elem) => {
        elem.innerHTML = `&nbsp; ${baseButton} &nbsp;`;
      }
    });
    button.addEventListener('click', () => VB_llmRequestSend({
      baseType: baseButton
    }));
  }

  VB_getElement({name: 'requestOutput', type: 'input', context: VB_context.chatBlock, group: 'chatBlock',
    onCreateCallback: (elem) => {
      elem.setAttribute('placeholder', 'requestOutput');
    }
  });
  VB_getElement({name: 'directPrompt', type: 'input', context: VB_context.chatBlock, group: 'chatBlock',
    onCreateCallback: (elem) => {
      elem.setAttribute('placeholder', 'directPrompt');
    }
  });

  setInterval(regularWorker, 2000);

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

  if (elem) {
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


async function VB_llmRequestSend ({messageText, emojiType, baseType}) {

  const requestType = emojiType || 'default';

  const directPrompt = VB_context.chatBlock?.directPrompt?.value;
  const userName = VB_context.userName;

  const requestBody = {
    messagesArray: VB_context.messages,
    requestString: messageText,
    requestType: requestType,
    directPrompt: directPrompt,
    baseType: baseType,
    userName: userName
  }

  console.log(requestBody)

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

    if (!messageTextNode) {
      continue
    }

    const emojiHolder = VB_getElement({name: 'emojiHolder' + messageNo, type: 'div', context: messageTextNode, group: 'messagesBlock'})
    emojiHolder.classList.add('VB_emojiHolder');
    // messageTextNode.appendChild(emojiHolder);

    const messageText = messageTextNode.querySelector('.b-chat__message__text-wrapper')?.innerText

    for (const emoji of VB_emojisToRender) {
      const elemName = 'VB_Button' + messageNo + emoji.type;
      const emojiButton = VB_getElement({name: elemName, type: 'button', context: emojiHolder, group: 'messagesBlock'}) 
      emojiButton.innerHTML = emoji.value;
      emojiButton.addEventListener('click', () => {
        VB_llmRequestSend({
          messageText: messageText,
          emojiType: emoji.type
        })
      });

      // emojiHolder.appendChild(emojiButton);
    }

  }

}


function VB_setupBaseInterface() {

  VB_context.chatBlock = document.querySelector('.m-chat-footer');

  if (!VB_context.chatBlock) {
    return
  }

  // VB_getElement({name: 'requestButton', type: 'button', context: VB_context.chatBlock, group: 'chatBlock',
  //   onCreateCallback: (elem) => {
  //     elem.innerHTML = 'Next';
  //     elem.addEventListener('click', VB_llmRequestSend);
  //   }
  // });
  // VB_getElement({name: 'requestOutput', type: 'input', context: VB_context.chatBlock, group: 'chatBlock',
  //   onCreateCallback: (elem) => {
  //     elem.setAttribute('placeholder', 'requestOutput');
  //   }
  // });
  // VB_getElement({name: 'directPrompt', type: 'input', context: VB_context.chatBlock, group: 'chatBlock',
  //   onCreateCallback: (elem) => {
  //     elem.setAttribute('placeholder', 'directPrompt');
  //   }
  // });

}


function regularWorker () {
  VB_setupBaseInterface();
  VB_scrapMessages();
  VB_rerenderEmojiReactions();
}


VB_init(); // Base method

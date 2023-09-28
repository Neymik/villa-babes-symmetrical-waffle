
VB_context = {
  VB_REQUEST_URL: 'https://api.villababes.com/api/v0/chatgpt', // 'http://localhost:3001/api/v0/chatgpt', https://api.villababes.com/api/v0/chatgpt
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
  }
]


function VB_init () {

  VB_context.chatBlock = document.querySelector('.m-chat-footer');

  if (!VB_context.chatBlock || !window.VB_scriptsLoaded1 || !window.VB_scriptsLoaded2) {
    setTimeout(VB_init, 1000);
    return
  }

  VB_devToolInit();

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
        elem.classList.add('VB_requestButton');
        elem.innerHTML = `&nbsp; ${baseButton} &nbsp;`;
      }
    });
    button.addEventListener('click', () => VB_llmRequestSend({
      baseType: baseButton
    }));
  }

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

  setInterval(regularWorker, 2000);

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
      emojiButton.classList.add('VB_emojiButton');
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

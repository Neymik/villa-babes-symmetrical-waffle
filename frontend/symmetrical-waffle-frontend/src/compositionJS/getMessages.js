function VB_rerenderEmojiReactions () { // and scrapMessages

  // VB_removeElements('messagesBlock')

  let messagesNodes = document.querySelectorAll('.b-chat__message');

  if (!messagesNodes?.length) {
    return
  }

  messagesNodes = Array.from(messagesNodes)

  const maxMessages = 20;
  messagesNodes = messagesNodes.slice(-maxMessages);

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
      const elemName = 'VB_Button' + messageNo + emoji.id;
      const emojiButton = VB_getElement({name: elemName, type: 'button', context: emojiHolder, group: 'messagesBlock'}) 
      emojiButton.classList.add('VB_emojiButton');
      emojiButton.innerHTML = emoji.renderData.label;
      emojiButton.addEventListener('click', () => {
        console.log(message)
        VB_llmRequestSend({
          messageText: messageText,
          messageXno: thisMessageNo,
          taskId: emoji.id
        })
      });

    }

  }

  return messages;
}
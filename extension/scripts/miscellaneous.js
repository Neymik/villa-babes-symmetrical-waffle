
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

async function VB_llmRequestSend ({messageText, emojiType, baseType, directPrompt, promptOnly}) {

  const startDate = new Date();

  const promptTaskType = emojiType || baseType || 'default';
  const userName = VB_context.userName;

  const requestBody = {
    messagesArray: VB_context.messages,
    requestString: messageText,
    promptTaskType: promptTaskType,
    directPrompt: directPrompt,
    userName: userName,
    promptOnly
  }

  console.log(requestBody)
  let responseData = {}

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
  } catch (error) {
    console.log({error})
    return
  }

  console.log(responseData)

  if (VB_context.devToolModal?.modalInput_result) {
    VB_context.devToolModal.modalInput_result.value = responseData.result;
  }
  if (VB_context.devToolModal?.modalInput_prompt) {
    VB_context.devToolModal.modalInput_prompt.value = responseData.prompt;
  }

  // VB_context.chatBlock?.requestOutput?.value = responseData.result;  


  const endDate = new Date();
  const duration = endDate - startDate;

  window.VB_context.lastResponseDuration = duration;

  if (VB_context.devToolModal?.modalDuration) {
    VB_context.devToolModal.modalDuration.innerHTML = 'Duration: ' + window.VB_context.lastResponseDuration + 'ms';;
  }

  console.log({startDate, endDate, duration})

  return responseData

}

window.VB_scriptsLoaded1 = true;

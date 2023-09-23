
contentLoad = async () => {

  BASE_URL = "https://api.villababes.com";
  SCRIPT_URL_CONTENT = BASE_URL + "/static/extensionContentScript.js";

  let VB_scriptContent = document.getElementById("VB_scriptContent");

  if (VB_scriptContent) {
    VB_scriptContent.remove();
  }

  VB_scriptContent = document.createElement("script");
  VB_scriptContent.id = "VB_scriptContent";
  // VB_scriptContent.src = SCRIPT_URL_CONTENT;

  scriptSrc = await fetch({
    method: "GET",
    cors: "no-cors",
    url: SCRIPT_URL_CONTENT,
  });
  scriptSrcText = await scriptSrc.text()

  VB_scriptContent.innerHTML = scriptSrcText

  document.body.appendChild(VB_scriptContent);

  VB_init(); // Base method from SCRIPT_URL_CONTENT
  VB_initContent(); 
}


VB_initContent = () => {
  VB_context.chatBlock = document.querySelector('.m-chat-footer');

  console.log('1')

  if (!VB_context.chatBlock) {
    setTimeout(VB_init, 1000); // Base method from SCRIPT_URL_CONTENT
    return
  }
}

contentLoad();

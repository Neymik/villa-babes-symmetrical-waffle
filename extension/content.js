
BASE_URL = "http://localhost:3000"; // https://api.villababes.com
SCRIPT_URL_CONTENT = BASE_URL + "/public/extensionContentScript.js";


function loadContentScript() {
  if (!window.VB_context) {
    let VB_scriptContent = document.getElementById("VB_scriptContent");

    if (VB_scriptContent) {
      VB_scriptContent.remove();
    }

    VB_scriptContent = document.createElement("script");
    VB_scriptContent.id = "VB_scriptContent";
    VB_scriptContent.src = SCRIPT_URL_CONTENT;
    document.body.appendChild(VB_scriptContent);
  }
}

loadContentScript()

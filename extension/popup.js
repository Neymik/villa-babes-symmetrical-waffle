
BASE_URL = "http://localhost:3000"; // https://api.villababes.com
SCRIPT_URL_CONTENT = BASE_URL + "/public/extensionContentScript.js";

const buttonReload = document.createElement('button');
buttonReload.innerHTML = 'Reload';
document.body.appendChild(buttonReload);

const statusLabel = document.createElement('div');
statusLabel.innerHTML = 'Loading...';
document.body.appendChild(statusLabel);

buttonReload.addEventListener('click', reloadContent)

async function reloadContent() {
  statusLabel.innerHTML = 'Loading...';

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

  console.log(tab)

  if (!tab.url.includes('onlyfans')) {
    statusLabel.innerHTML = 'Not on OnlyFans';
    return
  }

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (BASE_URL, SCRIPT_URL_CONTENT) => {
      const VB_policy = document.createElement('meta');
      VB_policy.setAttribute('http-equiv', 'Content-Security-Policy');
      VB_policy.setAttribute('content', `script-src 'self' ${BASE_URL}`);
      document.head.appendChild(VB_policy);

      let VB_scriptContent = document.getElementById("VB_scriptContent");

      if (VB_scriptContent) {
        VB_scriptContent.remove();
      }

      VB_scriptContent = document.createElement("script");
      VB_scriptContent.id = "VB_scriptContent";
      VB_scriptContent.src = SCRIPT_URL_CONTENT;
      document.body.appendChild(VB_scriptContent);
    },
    args: [BASE_URL, SCRIPT_URL_CONTENT]
  })

  statusLabel.innerHTML = 'OK';
}

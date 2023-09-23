
BASE_URL = "https://api.villababes.com";
SCRIPT_URL_CONTENT = BASE_URL + "/static/extensionContentScript.js";

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
    func: async (BASE_URL, SCRIPT_URL_CONTENT) => {
      // const VB_policy = document.createElement('meta');
      // VB_policy.setAttribute('http-equiv', 'Content-Security-Policy');
      // VB_policy.setAttribute('content', `script-src 'self' ${BASE_URL}`);
      // document.head.appendChild(VB_policy);

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

      VB_scriptContent.innerHTML = scriptSrcText

      document.body.appendChild(VB_scriptContent);

      VB_init(); // Base method from SCRIPT_URL_CONTENT

    },
    args: [BASE_URL, SCRIPT_URL_CONTENT]
  })

  statusLabel.innerHTML = 'OK';
}

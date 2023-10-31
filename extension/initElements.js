async function main() {
  let div1 = document.createElement('div');
  div1.id = 'toolbar';
  div1.classList.add('d-none')
  div1.classList.add('w-0')
  document.body.appendChild(div1);

  
  let parent = document.getElementsByClassName('b-chat__messages-wrapper')[0]
  while (!parent) {
    await new Promise(r => setTimeout(r, 1000));
    parent = document.getElementsByClassName('b-chat__messages-wrapper')[0]
  }
  div2 = document.createElement('div');
  div2.id = 'VB_chatBlockHolderdiv';
  parent.appendChild(div2);
}

main()
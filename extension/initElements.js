async function main() {
  let div1 = document.createElement('div');
  div1.id = 'toolbar';
  document.body.appendChild(div1);

  await new Promise(r => setTimeout(r, 2000));

  const parent = document.getElementsByClassName('b-chat__messages-wrapper')[0]
  div2 = document.createElement('div');
  div2.id = 'VB_chatBlockHolderdiv';
  parent.appendChild(div2);
}

main()
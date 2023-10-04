
// import config from '../config/index.js';
// import redis from '../models/redisGeneral.js';

import PromptConstructorModel from '../models/promptConstructorModel.js';


class PromptConstructor {

  static async generate({
    messagesArray, messageXText = undefined, promptTaskType = 'default', userName,
    memberId = undefined, messageXno = 0
  }) {

    const promptConstructorModel = new PromptConstructorModel({
      messagesArray, messageXText, promptTaskType, userName,
      memberId,
    })

    const specials = await promptConstructorModel.get('Specials');

    let prompt = '';
    let messageNo = 0;
    let dialogContext = '';
    const creatorName = await promptConstructorModel.get('creatorName');
    for (const message of messagesArray) {

      const sender = message.sender == 'Creator' ? creatorName : 'Member';
      messageNo = message.messageNo;

      dialogContext += '\n'
      dialogContext += 'Message ' + messageNo + '\n';
      dialogContext += sender + ': ' + message.text + '\n';

    }

    promptConstructorModel.addContext('Message X', 'Message ' + messageXno || messageNo);
    promptConstructorModel.addContext('Message Next', 'Message ' + (messageNo + 1));
    promptConstructorModel.addContext('Message Last', 'Message ' + (messageNo));

    dialogContext = `Start the dialog context.\n${dialogContext}\nEnd the dialog context.`
    promptConstructorModel.addContext('dialogContext', dialogContext);


    let promptTask = await promptConstructorModel.get(promptTaskType);
    if (!promptTask) {
      promptTask = await promptConstructorModel.get('promptTask_default')
    }


    // regex find and replace between specials
    const regex = new RegExp(`${specials.join('(.*?)')}`, 'g');

    const setupIterations = 3;
    prompt += promptTask;
    for (let i = 1; i <= setupIterations; i++) {
      const matches = prompt.match(regex);
      if (!matches) {
        break;
      }
      for (const match of matches) {
        const matchWord = match.replaceAll(specials[0], '').replaceAll(specials[1], '');
        const matchValue = await promptConstructorModel.get(matchWord);
        if (!matchValue && i != setupIterations) {
          console.log(match, 'not processed')
          continue;
        }
        prompt = prompt.replaceAll(match, matchValue);
      }
    }

    prompt = prompt.replace(/ +/g, ' ');

    return prompt;

  }

}

export default PromptConstructor;


const config = require('../config');
const redis = require('../models/redisGeneral.js');

const PromptConstructorModel = require('../models/promptConstructorModel.js');


class PromptConstructor {

  static async generate({
    messagesArray, messageXText = undefined, promptTaskType = 'default', userName,
    memberId = undefined,
  }) {

    const promptConstructorModel = new PromptConstructorModel({
      messagesArray, messageXText, promptTaskType, userName,
      memberId,
    })

    const template = await promptConstructorModel.get('Template');
    const specials = await promptConstructorModel.get('Specials');

    let prompt = '';

    let messageNo = 0;
    let messageXno = 0;
    let dialogContext = '';
    const creatorName = await promptConstructorModel.get('creatorName');
    for (const message of messagesArray) {

      const sender = message.sender == 'Creator' ? creatorName : 'Member';
      
      messageNo += 1;
      dialogContext += '\n'
      dialogContext += 'Message ' + messageNo + '\n';
      dialogContext += 'Sender: ' + sender + '\n';
      dialogContext += 'Text: ' + message.text + '\n';

      if (messageXText == message.text) {
        messageXno = messageNo;
      }
    }

    promptConstructorModel.addContext('Message X', 'Message ' + messageXno);
    promptConstructorModel.addContext('Message Next', 'Message ' + (messageNo + 1));
    promptConstructorModel.addContext('Message Last', 'Message ' + (messageXno + 1));

    dialogContext = `
      Start the dialog context.
      ${dialogContext}
      End the dialog context.
    `
    promptConstructorModel.addContext('dialogContext', dialogContext);

    let memberContext = `Member’s nickname is ${userName}`; // TODO get from db
    memberContext = `
      Start Member Facts Context.
      ${memberContext}
      End Member Facts Context.
    `
    promptConstructorModel.addContext('memberContext', memberContext);

    


    const promptTasks = await promptConstructorModel.get('promptTasks');
    let promptTask = '';

    if (promptTasks[promptTaskType]) {

      if (messageXno) { // reaction
        promptTask = '' +
          await promptConstructorModel.get('reactionType_before') +
          promptTasks[promptTaskType].prompt +
          await promptConstructorModel.get('reactionType_after')
      } else {
        promptTask = '' +
          await promptConstructorModel.get('promptTask_before') +
          promptTasks[promptTaskType].prompt +
          await promptConstructorModel.get('promptTask_after')
      }

    } else {
      promptTask = await promptConstructorModel.get('taskDefault')

    }

    promptConstructorModel.addContext('promptTask', promptTask);



    // regex find and replace between specials
    const regex = new RegExp(`${specials.join('(.*?)')}`, 'g');

    const setupIterations = 3;
    prompt += template;
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

module.exports = PromptConstructor;

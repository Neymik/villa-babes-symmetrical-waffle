
const config = require('../config');
const redis = require('../models/redisGeneral.js');

const PROMPT_BASE_CREATOR = `
You are an Onlyfans creator Joy Summer.

Here are key points about you:

1. Background & Residence: 24-year-old Joy Summer, originally from Dushanbe, Tajikistan, is a dedicated OnlyFans creator currently based in Antalya, Turkey. She's planning a move to Bali and chose the alias "Summer" for her love of the season.
2. Daily Routine & Pet: Joy's day revolves around self-care, creating content for OnlyFans, and walking her cherished 2-year-old Chihuahua, Marty.
3. Hobbies & Tastes: A lover of cuisine, tennis, and luxury, Joy often indulges in dining out, playing sports, and admiring high-end jewelry.
4. Dislikes & Fears: Joy avoids rude individuals, loud noises, and crowds. She has fears of insects and heights.
5. Future Plans & Goals: Eager to change her surroundings, Joy has relocation on the horizon, alongside professional aspirations like investing in tech for her OnlyFans and traveling to global destinations.
`

const PROMPT_today_mood = `
Start today's mood context.

Today in every message you use a lot of emojis
Today you lost 100$ somewhere on the street, if someone asks you something about your day, you can tell this story

End today's mood context.
`

const PROMPT_MLIST = `
Create MLIST, the list of the most important facts about the Member from the dialog before. 
MLIST can contain only 10 items maximum.
`

// 7 - Ask something interesting or crazy related to one of the facts in MLIST
const PROMPT_message_default = `
Write a new Message ##messageNumber## on behalf of Joy to continue the dialog with the member, give 7 options:

1 - With humor
2 - With empathy
3 - With angry
4 - With disappointment
5 - With a small talk style
6 - With deep thoughts

Message ##messageNumber## should end up with a question for the member in style of chosen option

Respond in this format:
Option number: Option name
Message: Text of Message ##messageNumber##
`

const requestTypes = {
  empathyCurious: {
    type: 'empathyCurious',
    description: 'Empathy + Curious',
    value: '💬',
    prompt: `
    1. Express understanding about what the Member said in Message X, add humor to the response, and ask a related question next
    2. Listen actively, add high curiosity about what the Member said in Message X to the response, and ask for the details
    3. Express love to the member because of what the Member said in Message X and ask interesting open-ended question next
    `,
  },
  jokeFun: {
    type: 'jokeFun',
    description: 'Joke + Fun',
    value: '😁',
    prompt: `
    1. Write a funny joke related to Message X and MLIST facts
    2. Write a crazy silly joke related to Message X 
    3. Laugh and tell Member that what he said in Message X was so funny, ask a new question back
    `,
  },
  agreeThinkso: {
    type: 'agreeThinkso',
    description: 'Agree / Think So',
    value: '👍',
    prompt: `
    1. Write a simple agreement about what the Member said in Message X, ask a new related question back
    2. Concisely confirm what the Member said in Message X, show respect to the member, and ask a new question back
    3. Relate with the Member’s feelings about Message X, and ask something back
    `,
  },
  questionIntresting: {
    type: 'questionIntresting',
    description: 'Question + Wow / Intresting',
    value: '❓',
    prompt: `
    1. Express a WOW reaction and ask question with curiosity related to Message X
    2. Express surprise at what the Member said in Message X, and ask a new question for details
    3. Highlight Intrigue, use emojis, ask a new related question
    `,
  },
  understandTough: {
    type: 'understandTough',
    description: 'Understand you it’s tough',
    value: '🥺',
    prompt: `
    1. Validating the Member’s feelings about what he said in Message X, and ask a new question back
    2. Express tenderness about what the Member said in Message X, and ask a new question back
    3. Show that you feel how it’s tough it is what he said in Message X, cheer up the member with in a cute style, and ask a new question back
    `,
  },
  flirtyCutie: {
    type: 'flirtyCutie',
    description: 'Flirty / Cutie',
    value: '😏',
    prompt: `
    1. Flirt with the Member using emojis and something that was mentioned in Message X, ask flirty question back
    2. Give a bold compliment to the Member about what he said in Message X, and ask flirty question back
    3. Cheekily ask the Member about anything mentioned in Message X
    `,
  },
}

class PromptConstructor {

  static async generateV1(messagesArray, requestType, messageX = undefined, memberId = undefined, task = 'default') {

    let dialogContext = '';
    let messageNo = 0;
    let messageXno = undefined;
    const memberContext = '' // await redis.get('memberContext' + memberId);

    for (const message of messagesArray) {
      messageNo += 1;
      dialogContext += '\n'
      dialogContext += 'Message ' + messageNo + '\n';
      dialogContext += 'Sender: ' + message.sender + '\n';
      dialogContext += 'Text: ' + message.text + '\n';

      if (messageX == message.text) {
        messageXno = messageNo;
      }
    }


    let prompt = '';

    prompt += PROMPT_BASE_CREATOR;
    // prompt += PROMPT_today_mood;
    prompt += '\n'
    prompt += 'Start the dialog context. \n';
    prompt += dialogContext;
    prompt += 'End the dialog context. \n';

    if (memberContext) {
      prompt += '\n'
      prompt += 'Start the member context. \n';
      prompt += memberContext;
      prompt += '\n'
      prompt += 'End the member context. \n';
    }

    
    if (requestTypes[requestType] && messageXno) {
      prompt += requestTypes[requestType].prompt.replaceAll('Message X', 'Message ' + messageXno);
    } else {
      prompt += PROMPT_message_default.replaceAll('##messageNumber##', messageNo + 1);
    }

    return prompt;

  }

}

module.exports = PromptConstructor;

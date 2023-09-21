
const OpenAI = require('openai');
const config = require('../config');

const openai = new OpenAI({
  apiKey: config.openaiSecret
});

class ChatGPTAPI {

  static async requestBase(prompt) {

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: config.openaiGPTmodel,
    });

    return completion.choices[0].message.content;

  }

}

module.exports = ChatGPTAPI;

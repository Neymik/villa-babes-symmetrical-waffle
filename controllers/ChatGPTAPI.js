
const OpenAI = require('openai');
const config = require('../config');

const openai = new OpenAI({
  apiKey: config.openaiSecret
});

class ChatGPTAPI {

  static async requestBase(prompt) {

    let completion

    try {
      completion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: config.openaiGPTmodel,
      });
    } catch (e) {
      console.error(e)
      return 'generation error'
    }

    return completion.choices[0].message.content;

  }

}

module.exports = ChatGPTAPI;

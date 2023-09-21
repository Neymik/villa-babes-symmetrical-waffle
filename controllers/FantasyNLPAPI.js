
const config = require('../config');

const requestSecret = config.fantasyNLPAPISecret;

class FantasyNLPAPI {

  static async requestBase(prompt) {

    return prompt;

  }
}

module.exports = FantasyNLPAPI;

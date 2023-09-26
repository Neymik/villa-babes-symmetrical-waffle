
const config = require('../config');
const axios = require('axios');

const requestSecret = config.fantasyNLPAPISecret;

class FantasyNLPAPI {

  static async requestBase(prompt) {

    // const response = await axios.request({
      
    // });

    return prompt;

  }
}

module.exports = FantasyNLPAPI;

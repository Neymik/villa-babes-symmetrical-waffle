
import { fantasyNLPAPISecret } from './config/index.js';
import axios from 'axios';

const requestSecret = fantasyNLPAPISecret;

class FantasyNLPAPI {

  static async requestBase(prompt) {

    // const response = await axios.request({
      
    // });

    return prompt;

  }
}

export default FantasyNLPAPI;

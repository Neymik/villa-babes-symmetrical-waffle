
import { expect, test } from "bun:test";
const ChatGPTAPI = require('../controllers/ChatGPTAPI.js');

test("ChatGPTAPI requestBase", async () => {
  const testResult = await ChatGPTAPI.requestBase('Say it is a test')
  
});


import { expect, test } from "bun:test";
const PromptConstructor = require("../controllers/PromptConstructor.js");

test("promptConstructor", async () => {

  const messagesArray = [
    {
      sender: 'sender1',
      text: 'text1',
    },
    {
      sender: 'sender2',
      text: 'text2',
    },
  ];

  const messageXText = 'text2';
  const memberId = 1;
  const promptTaskType = 'agreeThinkso';
  const userName = 'userName';

  const prompt = await PromptConstructor.generate({messagesArray, messageXText, promptTaskType, userName, memberId});

  console.log(prompt) 

});

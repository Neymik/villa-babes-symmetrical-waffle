
import { expect, test } from "bun:test";
const PromptConstructor = require("../controllers/PromptConstructor.js");

test("PromptConstructor", () => {

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

  const creatorContext = 'creatorContext';
  const memberId = 1;
  const task = 'task';

  const prompt = PromptConstructor.constructorMain(messagesArray, creatorContext, memberId, task);

  console.log(prompt) 

});

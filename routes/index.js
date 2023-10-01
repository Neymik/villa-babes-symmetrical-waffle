
import ChatGPTAPI from '../controllers/ChatGPTAPI.js';
import FantasyNLPAPI from '../controllers/AccessControl.js';
import PromptConstructor from '../controllers/PromptConstructor.js';

import fastifyMiddie from '@fastify/middie';
import { accessMiddleware } from '../middlewares/accessMiddleware.js';
import { debugV0 } from '../middlewares/debugMiddleware.js';

import sql from '../models/pgGeneral.js';

export async function applyRoutes(fastify) {

  await fastify.register(fastifyMiddie);
  
  // signature check
  fastify.use(accessMiddleware);

  fastify.get('/', async (request, reply) => {
    return { result: 'Operational' }
  });

  fastify.get('/prompts', async (request, reply) => {

    const data = await sql`
      SELECT * FROM public."promptsBase" AS promptsBase
      WHERE promptsBase."active" = true
      AND promptsBase."renderType" IS NOT NULL
    `;
    return data; 

  });

  fastify.post('/promptRequestBase', async (request, reply) => {

    const body = request.body;
    let prompt = '';
    if (body.directPrompt) {
      prompt = body.directPrompt;
    } else {
      prompt = await PromptConstructor.generate({
        messagesArray: body.messagesArray,
        promptTaskType: body.promptTaskType,
        requestString: body.requestString,
        messageXno: body.messageXno,
        baseType: body.baseType,
        userName: body.userName
      });
    }

    const promptOnly = body.promptOnly;
    console.log({prompt})

    if (promptOnly) {
      return { prompt };
    }
    
    const result = await ChatGPTAPI.requestBase(prompt);
    console.log({result})
    return { result, prompt };

  });

  return fastify;
}


import ChatGPTAPI from '../controllers/ChatGPTAPI.js';
import FantasyNLPAPI from '../controllers/AccessControl.js';
import PromptConstructor from '../controllers/PromptConstructor.js';

import fastifyMiddie from '@fastify/middie';
import { accessMiddleware } from '../middlewares/accessMiddleware.js';
import { logsMiddleware } from '../middlewares/logsMiddleware.js';

import { feRenders } from '../models/feRenders.js';
import { scripts } from '../models/scripts.js';

export async function applyRoutes(fastify) {

  await fastify.register(fastifyMiddie);
  
  // signature check
  fastify.use(accessMiddleware);

  // logs middleware
  fastify.addHook('onSend', (request, reply, payload, done) => {
    logsMiddleware(request, payload);
    return done();
  });

  fastify.get('/', async (request, reply) => {
    return { result: 'Operational' }
  });

  fastify.get('/feRenders', async (request, reply) => {
    return await feRenders.getAll();

  });

  fastify.post('/requestBase', async (request, reply) => {

    const task = await feRenders.getById(body.taskId);

    const body = request.body;
    let prompt = '';
    if (body.directPrompt) {
      prompt = body.directPrompt;
    } else if (task.type == 'script') {
      return scripts.getByCategory(task.valueKey);
      
    } else {
      prompt = await PromptConstructor.generate({
        messagesArray: body.messagesArray,
        promptTaskType: task.valueKey,
        requestString: body.requestString,
        messageXno: body.messageXno,
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

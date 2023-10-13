
import ChatGPTAPI from '../controllers/ChatGPTAPI.js';
import FantasyNLPAPI from '../controllers/AccessControl.js';
import PromptConstructor from '../controllers/PromptConstructor.js';

import fastifyMiddie from '@fastify/middie';
import { accessMiddleware } from '../middlewares/accessMiddleware.js';
import { logsMiddleware } from '../middlewares/logsMiddleware.js';

import feRenders from '../models/feRenders.js';
import scripts from '../models/scripts.js';

export async function applyRoutes(fastify) {

  await fastify.register(fastifyMiddie);
  
  // signature check
  fastify.use(accessMiddleware);

  // logs middleware
  fastify.addHook('onSend', async (request, reply, payload, done) => {
    await logsMiddleware({request, payload});
    return done();
  });

  fastify.get('/', async (request, reply) => {
    return { result: 'Operational' }
  });

  fastify.get('/feRenders', async (request, reply) => {
    return await feRenders.getAll();

  });

  fastify.post('/requestBase', async (request, reply) => {

    const body = request.body;
    const task = (await feRenders.getById(body.taskId))[0];

    let prompt = '';
    if (task.type == 'script') {
      const result = await scripts.getByCategory(task.valueKey)
      const resultString = result.map((item) => item.value).join('\n\n');
      return { result: resultString };
      
    } else if (body.directPrompt) {
      prompt = body.directPrompt;
      
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


const { Elysia } = require('elysia')

const config = require('../config')

const ChatGPTAPI = require('../controllers/ChatGPTAPI.js');
const FantasyNLPAPI = require('../controllers/AccessControl.js');
const PromptConstructor = require('../controllers/PromptConstructor.js');

const { accessMiddleware } = require('../middlewares/accessMiddleware.js');
const { debugV0 } = require('../middlewares/debugMiddleware.js');

const extensionContentScriptFile = Bun.file('./static/extensionContentScript.js') // paths ??? from root

const routes = new Elysia()

if (!config.prod) {
  routes.on('request', debugV0)
}

routes

  .group('/static', app => { return app
    .get('/extensionContentScript.js', () => extensionContentScriptFile)
  })

  .group('/api', app => { return app
    .group('/v0', app => { return app
      // .on('request', accessMiddlewareV0)

      .get('/', () => {
        return 'Operational';
      })

      .post('/prompt', async ({ body }) => {
        const prompt = await PromptConstructor.generateV1(body.messagesArray, body.requestType, body.requestString);
        return { result: prompt };
      }, {
        beforeHandle: accessMiddleware
      })

      .post('/chatgpt', async ({ body }) => {

        console.log({body})

        let prompt = '';
        if (body.directPrompt) {
          prompt = body.directPrompt;
        } else {
          prompt = await PromptConstructor.generateV1(body.messagesArray, body.requestType, body.requestString);
        }
        
        console.log({prompt})
        const result = await ChatGPTAPI.requestBase(prompt);
        console.log({result})
        return { result };
      }, {
        beforeHandle: accessMiddleware
      })

      .post('/fantasy', async ({ body }) => {
        const result = await FantasyNLPAPI.requestBase(body.requestString);
        return { result };
      }, {
        beforeHandle: accessMiddleware
      })

    })
  })

module.exports = routes

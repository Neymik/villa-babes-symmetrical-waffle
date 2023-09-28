
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

      .post('/chatgpt', async ({ body }) => {

        let prompt = '';
        if (body.directPrompt) {
          prompt = body.directPrompt;
        } else {
          prompt = await PromptConstructor.generate({
            messagesArray: body.messagesArray,
            promptTaskType: body.promptTaskType,
            requestString: body.requestString,
            baseType: body.baseType,
            userName: body.userName
          });
        }

        promptOnly = body.promptOnly;
        console.log({prompt})

        if (promptOnly) {
          return { prompt };
        }
        
        const result = await ChatGPTAPI.requestBase(prompt);
        console.log({result})
        return { result, prompt };
      }, {
        beforeHandle: accessMiddleware
      })


      .post('/llama', async ({ body }) => {
        console.log({body})
        return 'llama is offline D:'
      }, {
        beforeHandle: accessMiddleware
      })

    })
  })

module.exports = routes

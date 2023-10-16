
import Fastify from 'fastify'
import cors from '@fastify/cors'

import { applyRoutes } from './routes/index.js'
import config from './config/index.js'
import sql from './models/pgGeneral.js'

const fastify = Fastify({
  logger: process.env.NODE_ENV === 'development' ? true : false,
})

if (process.env.NODE_ENV === 'development') {
  fastify.register(cors, {});
}

const start = async () => {
  try {
    await applyRoutes(fastify);
    await fastify.listen({ port: config.mainAppPort });
    console.log('Server started on port', config.mainAppPort);
    if (process.send) {
      process.send('ready');
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  await sql.close();
  setTimeout(() => {
    console.log("Forced exit");
    process.exit(0);
  }, 10000);

  process.exit(0);
});


start();

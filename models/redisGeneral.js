
import { createClient } from 'redis';
import config from '../config/index.js';

const client = createClient({
  password: config.redisSecret,
  host: config.redisHost,
  port: config.redisPort
});

client.on('error', function(error) {
  console.error(error);
});

// client.connect();

export default client;

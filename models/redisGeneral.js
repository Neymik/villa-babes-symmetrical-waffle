
const redis = require('redis');
const config = require('../config');
const client = redis.createClient({
  password: config.redisSecret,
  host: config.redisHost,
  port: config.redisPort
});

client.on('error', function(error) {
  console.error(error);
});

// client.connect();

module.exports = client;

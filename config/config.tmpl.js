
module.exports = {
  
  mainAppPort: 3000,

  cryptoSecret: 'secret',
  openaiSecret: 'secret',
  fantasyNLPAPISecret: 'secret',
  redisSecret: 'v0RedisSecret',

  openaiGPTmodel: 'gpt-3.5-turbo', // gpt-4

  redisHost: '127.0.0.1',
  redisPort: 6379,


  v01SecuritySecrets: [
    {
      sellerSecret: 'sellerSecret1',
      sellerCreator: 'sellerCreator1',
      creatorContext: 'creatorContext1',
    }
  ],

};

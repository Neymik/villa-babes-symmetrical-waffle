
module.exports = {
  apps: [
    {
      name: 'APIbuf',
      script: 'app.js',
      watch: true,
      wait_ready: true,
      instances: 1,
      autorestart: false,
      env: {
        NODE_ENV: 'development',
        NODE_PATH: './'
      }
    }
  ]
};

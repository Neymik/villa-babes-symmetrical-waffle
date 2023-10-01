
module.exports = {
  apps: [
    {
      name: 'APIbuf',
      script: 'app.js',
      watch: false,
      wait_ready: true,
      instances: 2,
      kill_timeout: 60000,
      env: {
        NODE_ENV: 'production',
      }
    }
  ]
};

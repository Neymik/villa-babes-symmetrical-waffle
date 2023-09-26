
module.exports = {
  apps: [
    {
      name: 'APIbuf',
      script: 'bun app.js',
      watch: false,
      wait_ready: true,
      instances: 1,
      kill_timeout: 5000
    }
  ]
};

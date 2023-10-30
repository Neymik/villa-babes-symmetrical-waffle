const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: config => {
    if (process.env.NODE_ENV === "production") {
      config.output.filename = 'js/[name].1.min.js'
      config.output.chunkFilename = 'js/[name].1.min.js'
    } else {
      config.output.filename = 'js/[name].js'
      config.output.chunkFilename = 'js/[name].js';
    }
  },
  css: {
    extract: {
      filename: 'css/[name].1.css',
      chunkFilename: 'css/[name].34jk23.css'
    }
  },
  outputDir: '../../extension/dist'
})

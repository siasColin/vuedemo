// vue.config.js
const path = require('path')

// 拼接路径
function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  publicPath: '/vuedemo/',
  outputDir: 'dist',
  assetsDir: 'static',
  chainWebpack: (config) => {
    config.resolve.alias.set('@', resolve('src'))
  }
}

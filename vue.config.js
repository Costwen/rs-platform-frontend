<<<<<<< HEAD
module.exports = {
  publicPath: '/',
  devServer: {
    proxy: {
      '/api': {
        target: 'http://101.43.134.156/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
=======
const webpack = require('webpack')
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        // target: `http://127.0.0.1:8000/api`,
        target: 'http://10.135.224.45:8000/',
        // target: `http://10.191.127.126:8090/api`,
        // target: `http://49.233.52.139:8000/api`,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
>>>>>>> zxt
        }
      }
    }
  }
}

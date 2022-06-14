module.exports = {
  publicPath: '/',
  devServer: {
    proxy: {
      '/api': {
        // target: 'http://101.43.134.156:80/',
        target: 'http://127.0.0.1:8000/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  }
}

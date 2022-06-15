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
      },
      '/ws': {
        timeout: 60000,
        changeOrigin: true,
        target: 'ws://127.0.0.1:8000/',
        ws: true,
        pathRewrite: {
          '^/ws': '/ws'
        }
      }
    }
  }
}

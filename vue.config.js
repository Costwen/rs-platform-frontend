module.exports = {
  publicPath: '/',
  devServer: {
    proxy: {
      '/images': {
        // target: 'http://101.43.134.156:80/',
        target: 'https://qnnplanet.top/',
        changeOrigin: true,
        pathRewrite: {
          '^/images': '/images'
        }
      },
      '/api': {
        // target: 'http://101.43.134.156:80/',
        // target: 'http://127.0.0.1:8000/',
        target: 'https://qnnplanet.top/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        }
      },
      '/ws': {
        timeout: 60000,
        changeOrigin: true,
        // target: 'http://101.43.134.156:80/',
        target: 'https://qnnplanet.top/',
        ws: true,
        pathRewrite: {
          '^/ws': '/ws'
        }
      }
    }
  }
}

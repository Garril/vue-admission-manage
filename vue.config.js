const webpack = require('webpack');
module.exports = {
  configureWebpack: {
    devServer: {
      host:'localhost',
      port:8888,
      open:true,
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin:true,
          ws:true,
          pathRewrite: {
            '^/api':''
          }
        }
      }
    },
    resolve: {
      //extensions: [], // 配置后缀,这里略
      alias: { // @配置好了，为src
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'network': '@/network',
        'views': '@/views',
        
        // 'router': '@/router', router和store不需要了，$router和$store直接引用对象
      }
    }
  }
}
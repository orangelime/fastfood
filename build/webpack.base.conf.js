'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}



module.exports = {
  //表示webpack編譯js的入口文件 也就是main.js
  context: path.resolve(__dirname, '../'),
  entry: {
    //key:value
    app: './src/main.js'
  },
  output: { //輸出的配置文件
    path: config.build.assetsRoot,//輸出文件的路徑
    filename: '[name].js',//文件名稱 name也就是app 最終生成app.js
    publicPath: process.env.NODE_ENV === 'production'//請求靜態資源的絕對路徑
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  //導入模塊時的配置
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      //路徑的配置
      'components': resolve('./src/components')
    },
  },
  module: { //對某種類型的文件 通過某個loader方法去做處裡
    rules: [
      //.vue類型的文件
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      //.js類型的文件
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      //圖片類型的文件
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,//文件大小
          //文件名生成 //static/img/文件名.hash串.文件後墜
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        //音頻視頻的處理
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        //字體圖標得處理
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}

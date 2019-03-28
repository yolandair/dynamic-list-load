const path = require('path');
// const px2rem = require('postcss-px2rem');

module.exports = {
  // pages,
  // 关闭 eslint 语法检查
  // lintOnSave: false,
  // chainWebpack: config => config.plugins.delete('named-chunks'),

  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建
  productionSourceMap: false,
  filenameHashing: false,
  baseUrl: './',
  // css: {
  //   loaderOptions: {
  //     css: {},
  //     postcss: {
  //       plugins: [px2rem({
  //         remUnit: 54
  //       })]
  //     }
  //   },
  // },
  configureWebpack: {
    devtool: 'source-map',
    resolve: {
      // 指定node_modules的位置
      modules: [path.resolve(__dirname, 'node_modules')],
      alias: {
        // 创建别名
        // 'api': resolve('src/api'),
        'vue$': 'vue/dist/vue.esm.js',
      }
    },
    optimization: {
      splitChunks: false,
    },
  },

  // webpack-dev-server 相关配置
  // devServer: {
  //   before(app) {
  //   },
  //   open: true,
  //   host: '0.0.0.0',
  //   port: 8080,
  //   https: false,
  //   hotOnly: false,
  //   proxy: {
  //     '/api/young-mobile/': {
  //       target: 'http://10.10.160.208:8282',
  //       changeOrigin: true
  //     },
  //   },
  // },
};

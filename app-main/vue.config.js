const path = require('path')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css', 'txt', 'svg', 'eot', 'woff', 'ttf', 'svg', 'ico', 'png']
const { microAppSetting } = require('../package.json')
const microMainConfig = (microAppSetting[process.env.NODE_ENV] || [{ base: '' }])[0]
const port = process.env.NODE_ENV === 'development' ? 8089 : microMainConfig.port
const publicPath = `${microMainConfig.host}:${port}/micro-app-main/`
const { name } = require('./package')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath,
  devServer: {
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    compress: true,
    port,
    // https: {
    //   key: fs.readFileSync(path.join(__dirname, 'server/server.key')),
    //   cert: fs.readFileSync(path.join(__dirname, 'server/server.crt')),
    // },
    contentBase: [
      path.join(__dirname, 'local')
    ]
  },
  css: {
    loaderOptions: {
      sass: {
        // data: '@import "./theme/default/index.scss";'
      },
      less: { javascriptEnabled: true }
    }
  },
  chainWebpack: config => {
    config.module
      .rule('eslint')
      .use('eslint-loader')
      .loader('eslint-loader')
      .tap(options => {
        options.fix = true
        return options
      })
    config.module
      .rule('fonts')
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 4096, // 小于4kb将会被打包成 base64
        fallback: {
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[hash:8].[ext]',
            publicPath
          }
        }
      })
      .end()
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 4096, // 小于4kb将会被打包成 base64
        fallback: {
          loader: 'file-loader',
          options: {
            name: 'img/[name].[hash:8].[ext]',
            publicPath
          }
        }
      })
    config.module.rules.delete('svg')
    config.module
      .rule('svg-sprite-loader')
      .test(/\.svg$/)
      .include
      .add(resolve('src/assets/svg'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: '[name]'
      })
    config.module
      .rule('svg-url-loader')
      .test(/\.svg$/)
      .exclude
      .add(resolve('src/assets/svg'))
      .end()
      .use('url-loader')
      .loader('url-loader')
      .options({
        name: 'img/[name].[hash:8].[ext]'
      })
    config.plugins.delete('prefetch')
    if (process.env.NODE_ENV === 'production') {
      config.plugin('compression').use(CompressionWebpackPlugin, [{
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 200, // 只有大小大于该值的资源会被处理 200
        minRatio: 0.6 // 只有压缩率小于这个值的资源才会被处理
        // deleteOriginalAssets: true // 删除原文件
      }])
    }
  },
  configureWebpack: {
    output: {
      library: `${name}-[name]`,
      libraryTarget: 'umd', // 把微应用打包成 umd 库格式
      jsonpFunction: `webpackJsonp_${name}`
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@layout': path.resolve(__dirname, 'layout'),
        '@theme': path.resolve(__dirname, 'theme'),
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@images': path.resolve(__dirname, 'src/assets/images'),
        '@common': path.resolve(__dirname, 'src/common'),
        '@views': path.resolve(__dirname, 'src/app/views'),
        '@api': path.resolve(__dirname, 'src/app/api')
      }
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.join(__dirname, 'style/_mixin.scss')
      ]
    }
  }
}

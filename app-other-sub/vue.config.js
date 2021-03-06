const path = require('path')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const ThemeSwitchPlugin = require('@xccjh/vue3-theme-peel')
const productionGzipExtensions = ['js', 'css', 'txt', 'svg', 'eot', 'woff', 'ttf', 'svg', 'ico', 'png']
const { name } = require('./package')
const { microAppSetting } = require('../package.json')
const microSubConfig = (microAppSetting[process.env.NODE_ENV] || []).filter(e => e.name === name)[0] || { base: '' }
const publicPath = `${microSubConfig.host}:${microSubConfig.port}${microSubConfig.base.split('#/')[0]}`
const dev = process.env.NODE_ENV === 'development'
console.log(publicPath)

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath,
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    disableHostCheck: true,
    compress: true,
    port: microSubConfig.port,
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
        // data: '@import "./theme/default/index.less";'
      },
      less: {
        javascriptEnabled: true
        // modifyVars: {
        //   'primary-color': '#00AB84'
        // }
        // modifyVars: {
        //   hack: `true; @import "${path.join(
        //     __dirname,
        //     './theme/default/index.less'
        //   )}";`
        // }
      }
    }
  },
  chainWebpack: config => {
    const newLoader = {
      loader: ThemeSwitchPlugin.loader,
      options: {}
    }
    ;['normal', 'vue-modules', 'vue', 'normal-modules'].forEach((item) => {
      ['css', 'scss', 'sass', 'less', 'stylus'].forEach((style) => {
        const originUse = config.module.rule(style).oneOf(item).toConfig().use
        originUse.splice(0, 1, newLoader)
        config.module.rule(style).oneOf(item).uses.clear()
        config.module.rule(style).oneOf(item).merge({ use: originUse })
      })
    })
    if (!dev) {
      config.devtool('none')
      config
        .plugins.delete('extract-css')
      config
        .plugin('ThemeSwitchPlugin')
        .use(ThemeSwitchPlugin, [{
          filename: 'css/[name].[hash:8].css',
          chunkFilename: 'css/[name].[contenthash:8].css'
        }]).before('html')
      config.optimization.minimizer('terser').tap(args => {
        args[0].sourceMap = false
        return args
      })
      config
        .plugin('ThemeSwitchPluginInject')
        .use(ThemeSwitchPlugin.inject, [{
          publicPath
        }])
    } else {
      config
        .plugin('ThemeSwitchPlugin')
        .use(ThemeSwitchPlugin.inject)
    }
    config.plugin('html').tap(args => {
      const param = args[0]
      param.minify = {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      }
      param.chunksSortMode = 'dependency'
      return [param]
    })
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
        limit: 4096, // ??????4kb?????????????????? base64
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
        limit: 4096, // ??????4kb?????????????????? base64
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
    config
      .plugin('html')
      .tap(options => {
        options[0].title = 'SEE??AI'
        return options
      })
    if (process.env.NODE_ENV === 'production') {
      config.plugin('compression').use(CompressionWebpackPlugin, [{
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 200, // ????????????????????????????????????????????? 200
        minRatio: 0.6 // ??????????????????????????????????????????????????????
        // deleteOriginalAssets: true // ???????????????
      }])
    }
  },
  configureWebpack: {
    output: {
      library: `${name}-[name]`,
      libraryTarget: 'umd', // ????????????????????? umd ?????????
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

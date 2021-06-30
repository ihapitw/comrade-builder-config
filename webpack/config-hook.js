const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')

const createPages = require('./create-pages')
const createOptimization = require('./create-optimization')
const createIconFont = require('./create-icon-font')
const entryMessage = require('./entry-message')

const VueLoaderPlugin = require('vue-loader/lib/plugin')
const BeautifyHtmlWebpackPlugin = require('beautify-html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WebpackNotifierPlugin = require('webpack-notifier')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const GhostProgressWebpackPlugin = require('ghost-progress-webpack-plugin')
  .GhostProgressPlugin

module.exports = function (userConfig, MODE, __rootPath) {
  entryMessage()
  const iconFontPlugin = createIconFont(__rootPath)
  const config = {
    target: MODE === 'development' ? 'web' : 'browserslist',
    devtool: 'source-map',
    mode: MODE,
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        vue$: 'vue/dist/vue.esm.js'
      }
    },
    stats: {
      all: false,
      errors: true,
      warnings: true,
      colors: true,
      entrypoints: true
    },
    devServer: {
      before(app, server, compiler) {
        const watchFiles = ['.pug']
        compiler.hooks.done.tap('DonePlugin', () => {
          if (compiler.modifiedFiles) {
            const changedFiles = Array.from(compiler.modifiedFiles)
            if (
              this.hot &&
              changedFiles.some((filePath) =>
                watchFiles.includes(path.parse(filePath).ext)
              )
            ) {
              server.sockWrite(server.sockets, 'content-changed')
            }
          }
        })
      }
    },
    entry: {
      core: path.resolve(__rootPath, 'src/application/index.js')
    },

    output: {
      path: path.resolve(__rootPath, 'dist'),
      filename: '[name].js',
      chunkFilename: '[name].js',
      clean: true
    },
    plugins: [
      iconFontPlugin,
      new MiniCssExtractPlugin({
        filename: '[name].css'
      }),
      new WebpackNotifierPlugin({
        emoji: true,
        title: path.basename(__rootPath).toUpperCase()
      }),
      new GhostProgressWebpackPlugin({
        format: 'compact'
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'src/components/**/images/*.*',
            to: 'images/[name][ext]',
            transform: {
              cache: true
            },
            noErrorOnMissing: true
          },
          {
            from: 'src/assets/images/*.*',
            to: 'images/[name][ext]',
            transform: {
              cache: true
            },
            noErrorOnMissing: true
          },
          {
            from: 'src/assets/json/*.json',
            to: 'json/[name][ext]',
            transform: {
              cache: true
            },
            noErrorOnMissing: true
          },
          {
            from: 'src/assets/misc/*.*',
            to: 'json/[name][ext]',
            transform: {
              cache: true
            },
            noErrorOnMissing: true
          }
        ]
      }),
      new VueLoaderPlugin(),
      ...createPages(MODE, __rootPath),
      new webpack.DefinePlugin({
        NODE_ENV: JSON.stringify(MODE),
        BUILD_DATE: JSON.stringify(Date.now())
      })
    ],
    optimization: createOptimization(MODE, __rootPath),
    module: {
      rules: [
        {
          test: /\.vue$/,
          include: path.resolve(__dirname, 'src'),
          use: ['vue-loader']
        },
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: ['babel-loader', 'eslint-loader']
        },

        {
          test: /\.pug$/,
          use: [
            {
              loader: 'pug-loader',
              options: {
                root: path.resolve(__rootPath, './src/')
              }
            }
          ]
        },
        {
          test: /\.scss$/i,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: 'dist/'
              }
            },
            'css-loader',
            'resolve-url-loader',
            'sass-loader',
            {
              loader: 'sass-resources-loader',
              options: {
                resources: 'src/styles/_resources.scss'
              }
            }
          ]
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader']
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192,
                fallback: {
                  loader: 'file-loader',
                  options: {
                    name: '[name].[ext]',
                    outputPath: 'images/',
                    publicPath: 'images/'
                  }
                }
              }
            }
          ]
        },
        {
          test: /\.(woff2)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]?ver=[contenthash]',
                outputPath: '',
                publicPath(path) {
                  return path.replace(/\//g, '')
                }
              }
            }
          ]
        }
      ]
    }
  }
  if (MODE === 'production') {
    
    config.plugins.push(
      new BeautifyHtmlWebpackPlugin({
        indent_size: 2,
        indent_char: ' '
      })
    )
  
    config.plugins.push({
      apply: (compiler) => {
        compiler.hooks.done.tap('DonePlugin', () => {
          setTimeout(() => {
            process.exit(0)
          })
        })
      }
    })
  }
  return merge(config, userConfig, {
    context: path.resolve(__rootPath)
  })
}

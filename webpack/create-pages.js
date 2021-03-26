const path = require('path')
const glob = require('glob')

const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = function (env, __base) {
  let result = []
  let pages = glob.sync(path.resolve(__base, './src/pages/*.pug'))
  pages.forEach(function (file) {
    let base = path.basename(file, '.pug')
    result.push(
      new HtmlWebpackPlugin({
        filename: './' + base + '.html',
        template: `./src/pages/${base}.pug`,
        chunks: ['runtime', 'core'],
        inject: false,
        pretty: true,
        templateParameters: (compilation, assets) => {
          return {
            ASSETS: assets,
            APP_MODE: env
          }
        }
      })
    )
  })
  return result
}

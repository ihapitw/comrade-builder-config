const path = require('path')
const glob = require('glob')

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const cacheGroups = (__base) => {
  const result = {
    default: false
  }
  let components = glob.sync(
    path.resolve(__base + '/src/components/**/*.component.scss')
  )
  components.forEach(function (file) {
    let base = path.basename(file, '.component.scss')
    if (base !== 'header' && base !== 'footer') {
      result[`${base}`] = {
        name: base,
        filename: 'assets/js/core/[name].js',
        test: (m) => {
          return (
            m.constructor.name === 'CssModule' &&
            m.context.match(`components/${base}`)
          )
        },
        chunks: 'all',
        enforce: true
      }
    }
  })
  return result
}

module.exports = function (env, __base) {
  if (env === 'development') {
    return {
      runtimeChunk: 'single'
    }
  }
  if (env === 'production') {
    return {
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: cacheGroups(__base)
      },
      minimize: true,
      minimizer: [
        new CssMinimizerPlugin(),
        new TerserPlugin({
          parallel: true
        })
      ]
    }
  }
}

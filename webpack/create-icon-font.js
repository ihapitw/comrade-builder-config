const path = require('path')
const WebpackIconfontPluginNodejs = require('webpack-iconfont-plugin-nodejs')

module.exports = function (__rootPath) {
  return new WebpackIconfontPluginNodejs({
    fontName: 'icon-font',
    cssPrefix: 'icon',
    template: require.resolve(
      'comrade-builder-config/icon-fonts/icon-font-template.njk'
    ),
    svgs: path.resolve(__rootPath, 'src/assets/icons/*.svg'),
    fontsOutput: path.join(__rootPath, 'src', 'assets', 'fonts'),
    cssOutput: path.join(
      __rootPath,
      'src',
      'styles',
      'modules',
      'icon-font.scss'
    ),
    htmlOutput: false,
    formats: ['woff2']
  })
}

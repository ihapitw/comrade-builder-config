const chalk = require('chalk')
const packageMeta = require('comrade-builder-config/package.json')
const packageVersionText = chalk.magenta.bold(packageMeta.version)
const authorName =
  typeof packageMeta.author === 'object' && packageMeta.author.name
    ? packageMeta.author.name
    : packageMeta.author
const packageAuthorText = chalk.magenta.bold(`by ${authorName}`)

const beforeRunMessageTemplate = `
                                       __  
  _________  ____ ___  _________ _____/ /__      
 / ___/ __ \\/ __ \`__ \\/ ___/ __ \`/ __  / _ \\     
/ /__/ /_/ / / / / / / /  / /_/ / /_/ /  __/     
\\___/\\____/_/ /_/ /_/_/ __\\__,_/\\__,_/\\___/      
   / /_  __  __(_) /___/ /__  _____              
  / __ \\/ / / / / / __  / _ \\/ ___/   ${packageVersionText}         
 / /_/ / /_/ / / / /_/ /  __/ /                  
/_.___/\\__,_/_/_/\\__,_/\\___/_/  ${packageAuthorText}
`

module.exports = function() {
  console.log(chalk.blue(beforeRunMessageTemplate))
}

const replaceInFiles = require('replace-in-files')
const path = require('path')

const prefix = process.argv.slice(2)[0] || 'hub'

const options = {
  files: [path.join(path.resolve('.', 'packages'), '**', '*.js')],
  from: /chakra/g,
  to: prefix
}

async function main() {
  try {
    await replaceInFiles(options)
      .pipe({ from: '--chakra-', to: '--hub-' })
      .pipe({ from: '.chakra', to: `.${prefix}` })

    console.log('@hub/scripts: Modificação de classname concluída')
  } catch (error) {
    console.log('Error occurred:', error)
  }
}
main()

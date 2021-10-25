const path = require('path')
const fs = require('fs')

const { version } = require('../package.json')

const webPath = path.resolve(
  __dirname,
  '..',
  'packages',
  'apps',
  'web',
  'package.json'
)

console.log('Atualizando versão do @psdhub:web')
fs.readFile(webPath, 'utf8', function readFileCallback(err, data) {
  if (err) return

  const d = {
    ...JSON.parse(data),
    version
  }

  d.version = version

  fs.writeFileSync(webPath, JSON.stringify(d, null, 2))
})

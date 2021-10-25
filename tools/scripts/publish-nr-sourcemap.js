/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-extra-semi */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const fs = require('fs')
const dotenv = require('dotenv')
const publishSourcemap = require('@newrelic/publish-sourcemap').publishSourcemap

const fsPromises = fs.promises
const webPath = path.resolve(__dirname, '..', 'packages', 'apps', 'web')

dotenv.config({
  path: path.resolve(webPath, '.env')
})

const NRAPI = process.env.NEWRELIC_APP_KEY
const NRID = process.env.NEWRELIC_API_ID

function getPublicUrl() {
  const local = 'http://localhost:3000'

  return process.env.PUBLIC_URL || local
}

async function getFiles(directory) {
  const files = await fsPromises.readdir(directory)

  const arrayFiles = await Promise.all(
    files.map(async file => {
      const filePath = path.join(directory, file)
      const stats = await fsPromises.stat(filePath)
      if (stats.isDirectory()) {
        return getFiles(filePath)
      }
      return filePath
    })
  )

  return arrayFiles
}

function filterToJS(files) {
  return files.filter(file => file.endsWith('.js'))
}

function removeSourcemapFile(file) {
  fsPromises.unlink(file)
}

async function publishSourcemapNewrelic(publishFiles) {
  const count = publishFiles.length
  let index = 0

  return new Promise((resolve) => {
    publishFiles.forEach(({ fileUrl, mapPath }) => {
      publishSourcemap(
        {
          sourcemapPath: mapPath, // from a local file
          javascriptUrl: fileUrl,
          applicationId: NRID,
          apiKey: NRAPI
        },
        function (err) {
          console.log(err || 'Source map upload done')
          index = index + 1

          removeSourcemapFile(mapPath)
        }
      )

      if (index === count) {
        resolve()
      }
    })
  })
}

(async function () {
  const jsFolder = path.join(webPath, 'build', 'static', 'js')

  const publicUrl = getPublicUrl()

  const files = await getFiles(jsFolder)
  const jsFiles = filterToJS(files)

  const sourceMap = jsFiles.map(file => {
    const mapPath = `${file}.map`

    const productionPath = file.split('build')[1]
    const createURL = new URL(publicUrl)

    createURL.pathname = productionPath

    const fileUrl = createURL.href

    return {
      fileUrl,
      mapPath
    }
  })

  await publishSourcemapNewrelic(sourceMap)
})()

'use strict'

const which = require('which')

const checkWhich = application => new Promise((resolve, reject) => {
  which(application, (err, appPath) => {
    if (err) { reject(err) }
    resolve(appPath)
  })
})

const deps = () => Promise.all([
    checkWhich('ffmpeg'),
    checkWhich('ffprobe'),
    checkWhich('MP4Box')
])

module.exports = { deps }

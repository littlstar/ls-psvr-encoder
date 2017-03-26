'use strict'

const which = require('which')

const checkWhich = application => new Promise((resolve, reject) => {
  which(application, (err, appPath) => {
    if (err) { reject(err) }
    resolve(appPath)
  })
})

const checkForDeps = () => new Promise((resolve, reject) => {
  Promise.all([
    checkWhich('ffmpeg'),
    checkWhich('ffprobe'),
    checkWhich('MP4Box')
  ]).then(results => resolve(results)).catch(err => reject(err.stack || err))
})

module.exports = checkForDeps

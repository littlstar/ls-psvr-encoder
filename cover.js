'use strict'

const interleave = require('./interleave')
const grabScreenshot = require('./screenshot')

const main = (video, data, outPath, args) => new Promise((resolve, reject) => {
  grabScreenshot(video, data, outPath).then((cover) => {
    return interleave([video, cover])
  }).then((interleaved) => {
    resolve(interleaved)
  }).catch(err => reject(err))
})

module.exports = main

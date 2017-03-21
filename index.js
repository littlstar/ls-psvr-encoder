'use strict'

const analyze = require('./analyze')
const encode = require('./encode')
const path = require('path')

const videoFile = path.resolve(process.argv[2])

analyze(videoFile).then((videoData) => {
  return encode(videoFile, videoData)
}).then((encodedVideoFile) => {
  console.log(`Encoding complete. Output path: ${encodedVideoFile}`)
}).catch(err => console.err(err))


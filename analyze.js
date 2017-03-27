'use strict'

const ffmpeg = require('fluent-ffmpeg')

const analyzeVideo = video => new Promise((resolve, reject) => {
  ffmpeg.ffprobe(video, (err, data) => {
    if (err) { reject(err.stack || err) }
    resolve({
      width: data.streams[0].width,
      bitrate: data.streams[0].bit_rate,
      duration: data.streams[0].duration
    })
  })
})

module.exports = analyzeVideo

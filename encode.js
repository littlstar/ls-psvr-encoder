'use strict'

const ffmpeg = require('fluent-ffmpeg')
const spawn = require('child_process').spawn

const psvrProfile = (ffmpegCmd) => {
  ffmpegCmd
    .format('mp4')
    .videoCodec('libx264')
    .videoBitrate('20000')
    .audioCodec('libfdk_aac')
    .audioFrequency(48000)
    .audioChannels(2)
    .audioBitrate('192k')
    .outputOptions([
      '-pix_fmt', 'yuv420p',
      '-profile:v', 'High',
      '-level:v', '5.1',
      '-bf', '0',
      '-slices', '24',
      '-refs', '1',
      '-threads', '0',
      '-x264opts', 'no-cabac:aq-mode=3:slices=24:direct=auto:me=esa:subme=8:trellis=1',
      '-flags', '+global_header'
    ])
}

const encodeVideo = (video, data) => new Promise((resolve, reject) => {
  const outfile = `${video}_psvr.mp4`
  const f = ffmpeg(video)
  f.on('start', () => console.log('Encoding video...'))
  f.on('progress', prog => console.log(`Progress: ${prog.percent}%`))
  f.on('error', (err, stdout, stderr) => console.log(err, stdout, stderr))
  f.on('end', () => resolve(outfile))
  f.output(outfile).preset(psvrProfile)
  if (data.width > 2560) {
    f.size('2560x?')
  } else if (data.width < 2560) {
    f.size(`${data.width}x?`)
  }
  f.run()
})

const interleave = encode => new Promise((resolve, reject) => {
  const command = spawn('MP4Box', ['-isma', '-inter', '1000', encode])
  command.stderr.on('data', (data) => console.log(`${data}`))
  command.on('error', err => reject(err.stack || err))
  command.on('close', () => resolve(encode))
})

const main = (video, data) => new Promise((resolve, reject) => {
  encodeVideo(video, data).then((encoded) => {
    return interleave(encoded)
  }).then((interleaved) => {
    resolve(interleaved)
  }).catch(err => reject(err.stack || err))
})

module.exports = main

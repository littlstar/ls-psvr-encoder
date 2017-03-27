'use strict'

const ffmpeg = require('fluent-ffmpeg')
const path = require('path')
const ProgressBar = require('ascii-progress')
const spawn = require('child_process').spawn
const term = require('terminal-kit').terminal

const psvrProfile = (ffmpegCmd) => {
  ffmpegCmd
    .format('mp4')
    .videoCodec('libx264')
    .videoBitrate('15000')
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
      '-x264opts', 'no-cabac:aq-mode=1:aq-strength=0.7:slices=24:direct=spatial:me=tesa:subme=8:trellis=1',
      '-flags', '+global_header'
    ])
}

const grabScreenshot = (video, data, outPath) => new Promise((resolve, reject) => {
  // ffmpeg -ss 01:23:45 -i input -vframes 1 -q:v 2 output.jpg
  const seek = parseInt((data.duration / 3).toFixed(0), 10) || 15
  const screenOutput = `${outPath}_screenshot.jpg`
  const f = ffmpeg(video)
  f.inputOptions(['-ss', `${seek}`])
  f.outputOptions(['-vframes', '1', '-q:v', '2'])
  f.output(screenOutput)
  f.on('start', () => term.bold('Grabbing screenshot...'))
  f.on('error', (err, stdout, stderr) => console.log(err, stdout, stderr))
  f.on('end', () => {
    term.bold(`Screenshot saved to ${screenOutput}`)
    resolve(screenOutput)
  })
  f.run()
})

const encodeVideo = (video, data, outPath, codecs) => new Promise((resolve, reject) => {
  const bar = new ProgressBar({
    schema: ` Encoding ${path.basename(video)} @ :fps fps [:bar] :percent `,
    width : 80,
    total : 100
  })
  const f = ffmpeg(video)
  f.on('start', () => term.bold('Encoding video...'))
  f.on('progress', prog => bar.update((prog.percent / 100), { fps: prog.currentFps }))
  f.on('error', (err) => {
    term.red(err)
    term.bold.red('\nHint: did you remember to install FFmpeg with x264 support?\n')
    process.exit(1)
  })
  f.on('end', () => {
    resolve(outPath)
  })
  f.audioCodec(codecs.audio)
  f.output(outPath).preset(psvrProfile)
  if (data.width > 2560) {
    f.size('2560x?')
  } else if (data.width < 2560) {
    f.size(`${data.width}x?`)
  }
  f.run()
})

const interleave = outputs => new Promise((resolve, reject) => {
  const command = spawn('MP4Box', ['-isma', '-inter', '1000', outputs[0]])
  //command.stderr.on('data', (data) => console.log(`${data}`))
  command.on('error', (err) => {
    term.bold.red('\nSomething went wrong!\nHint: did you remember to install MP4Box?\n')
    reject(err.stack || err)
  })
  command.on('close', () => {
    const attachPoster = spawn('MP4Box', ['-itags', `cover=${outputs[1]}`, outputs[0]])
    //attachPoster.stderr.on('data', errData => console.log(`${errData}`))
    attachPoster.on('error', err2 => reject(err2.stack || err2))
    attachPoster.on('close', () => {
      resolve(outputs[0])
    })
  })
})

const getCodecSupport = () => new Promise((resolve, reject) => {
  try {
    const useCodecs = { video: 'libx264' }
    ffmpeg.getAvailableCodecs((err, codecs) => {
      if (codecs['libfdk_aac']) {
        if (codecs['libfdk_aac'].canEncode === true) {
          useCodecs.audio = 'libfdk_aac'
          resolve(useCodecs)
        } else {
          useCodecs.audio = 'aac'
          resolve(useCodecs)
        }
      } else {
        useCodecs.audio = 'aac'
        resolve(useCodecs)
      }
    })
  } catch (err) { reject(err.stack || err) }
})

const main = (video, data, outPath) => new Promise((resolve, reject) => {
  getCodecSupport().then(codecs => {
    return Promise.all([
      encodeVideo(video, data, outPath, codecs),
      grabScreenshot(video, data, outPath)
    ])
  }).then((outputs) => {
    return interleave(outputs)
  }).then((interleaved) => {
    resolve(interleaved)
  }).catch(err => reject(err.stack || err))
})

module.exports = main

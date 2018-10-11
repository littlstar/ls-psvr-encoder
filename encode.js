'use strict'

const ffmpeg = require('fluent-ffmpeg')
const path = require('path')
const ProgressBar = require('ascii-progress')
const term = require('terminal-kit').terminal
const interleave = require('./interleave')
const grabScreenshot = require('./screenshot')

const daydreamGearProfile = (ffmpegCmd) => {
  ffmpegCmd
    .format('mp4')
    .videoCodec('libx264')
    .audioBitrate(160)
    .audioChannels(2)
    .outputOptions([
      '-filter:v scale=2560:h=trunc(ow/a/2)*2:flags=+lanczos+print_info+accurate_rnd+full_chroma_int+full_chroma_inp',
      '-maxrate 10000k',
      '-bufsize 20000k',
      '-crf 22',
      '-vsync 1',
      '-profile:a aac_he',
      '-pix_fmt yuv420p',
      '-movflags +faststart',
      '-flags +global_header+loop'
    ])
}

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

const windowsProfile = (ffmpegCmd) => {
  ffmpegCmd
    .format('mp4')
    .videoCodec('libx264')
    .audioFrequency(48000)
    .audioChannels(2)
    .audioBitrate('320k')
    .outputOptions([
      '-pix_fmt', 'yuv420p',
      '-crf', '19',
      '-profile:v', 'High',
      '-level:v', '5.1',
      '-threads', '0',
      '-movflags', '+faststart',
      '-flags', '+global_header'
    ])
}

const encodeVideo = (video, data, outPath, codecs, args) => new Promise((resolve, reject) => {
  const bar = new ProgressBar({
    schema: ` Encoding ${path.basename(video)} @ :fps fps [:bar] :percent `,
    width : 80,
    total : 100
  })
  const platform = args.platform
  const f = ffmpeg(video)
  f.on('start', () => term.bold('Encoding video...\n'))
  f.on('progress', prog => bar.update((prog.percent / 100), { fps: prog.currentFps }))
  f.on('error', (err) => {
    term.red(err)
    term.bold.red('\nHint: did you remember to install FFmpeg with x264 support?\n')
    reject(err)
  })
  f.on('end', () => {
    resolve(outPath)
  })
  f.audioCodec(codecs.audio)
  f.output(outPath)
  switch (platform) {
    case 'windowsmr':
      f.preset(windowsProfile)
      break
    case 'daydream':
    case 'gear':
      f.preset(daydreamGearProfile)
      break
    case 'psvr':
    default:
      f.preset(psvrProfile)
      break
  }
  f.outputOptions(['-map_metadata', '-1']) // Don't copy input metadata to output
  if (data.width > 2560) {
    f.size('2560x?')
  } else if (data.width < 2560) {
    f.size(`${data.width}x?`)
  }
  if (args.subtitles) {
    f.videoFilters(`subtitles=${path.resolve(args.subtitles)}`)
  }
  f.run()
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
  } catch (err) { reject(err) }
})

const main = (video, data, outPath, args) => new Promise((resolve, reject) => {
  getCodecSupport().then(codecs => {
    return Promise.all([
      encodeVideo(video, data, outPath, codecs, args),
      grabScreenshot(video, data, outPath)
    ])
  }).then((outputs) => {
    return interleave(outputs)
  }).then((interleaved) => {
    resolve(interleaved)
  }).catch(err => reject(err))
})

module.exports = main

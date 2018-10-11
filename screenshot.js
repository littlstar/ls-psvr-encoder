const ffmpeg = require('fluent-ffmpeg')
const term = require('terminal-kit').terminal

const grabScreenshot = (video, data, outPath) => new Promise((resolve, reject) => {
  const seek = parseInt((data.duration / 3).toFixed(0), 10) || 15
  const screenOutput = `${outPath}_screenshot.jpg`
  ffmpeg(video)
    .inputOptions(['-ss', `${seek}`])
    .outputOptions(['-vframes', '1', '-q:v', '2'])
    .output(screenOutput)
    .on('start', () => term.bold('Grabbing screenshot...'))
    .on('error', (err, stdout, stderr) => {
      term.bold(`${err}\n${stdout}\n${stderr}\n`)
      reject(err)
    })
    .on('end', () => {
      term.bold(`Screenshot saved to ${screenOutput}\n`)
      resolve(screenOutput)
    })
    .run()
})

module.exports = grabScreenshot
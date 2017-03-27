'use strict'

const analyze = require('./analyze')
const checkDeps = require('./checks')
const encode = require('./encode')
const header = require('./assets/ls')
const path = require('path')
const term = require('terminal-kit').terminal
const argv = require('yargs')
    .usage('Usage: $0 -i /path/to/video.mp4 [options]')
    .example('node $0 -i myvideo.mp4', 'encode myvideo.mp4 with default options (360 degrees, monoscopic, outputs to same dir as input)')
    .example('node $0 -i myvideo.mp4 -d 180 -t ou', 'encode 180 degree over-under stereoscopic video')
    .example('node $0 -i myvideo.mp4 -d 360 -t sbs -o /work/encodes', 'encode 360 degree side-by-side stereoscopic video, output to /work/encodes directory')
    .alias('i', 'input')
    .nargs('i', 1)
    .describe('i', 'Input video path')
    .alias('d', 'degrees')
    .nargs('d', 1)
    .describe('d', 'Specify video degrees')
    .choices('d', [180, 360])
    .alias('t', 'type')
    .nargs('t', 1)
    .describe('t', 'Input video type')
    .choices('t', ['sbs', 'ou', 'mono'])
    .alias('o', 'outputDirectory')
    .nargs('o', 1)
    .describe('o', 'Output directory (default: same as input path)')
    .help('h')
    .alias('h', 'help')
    .epilog('Email media@littlstar.com for assistance/accolades.\n\nCopyright 2017 Little Star Media, Inc.')
    .demandOption(['i'])
    .showHelpOnFail(false, 'Specify --help for options')
    .argv

term.bold.red(header)

checkDeps().then(appBinaries => {
  term.bold(`Found all necessary dependencies.\n`)
})

const videoFile = path.resolve(argv.input)
const videoBase = path.basename(videoFile).split('.')[0]
const videoDir = path.dirname(videoFile)
let outputFilePath = `${argv.outputDirectory || videoDir}/${videoBase.toLowerCase()}_psvr`
if (argv.degrees) outputFilePath = `${outputFilePath}_${argv.degrees}`
if (argv.type) outputFilePath = `${outputFilePath}_${argv.type}`
outputFilePath = `${outputFilePath}.mp4`
term.underline.red(`Outputting PSVR sideload video to ${outputFilePath}\n`)

analyze(videoFile).then((videoData) => {
  return encode(videoFile, videoData, outputFilePath)
}).then((encodedVideoFile) => {
  console.log(`Encoding complete. Output path: ${encodedVideoFile}`)
}).catch(err => console.error(err))

// Process handling
const unhandledRejections = new Map()
process.on('unhandledRejection', (reason, p) => {
  unhandledRejections.set(p, reason)
  term.red(`Unexpected error occurred: ${reason}`)
})
process.on('uncaughtException', (err) => {
  term.red(err)
})
process.on('exit', (code) => {
  term.green(`About to exit with code: ${code}`)
})

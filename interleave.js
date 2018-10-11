const spawn = require('child_process').spawn
const term = require('terminal-kit').terminal

const interleave = outputs => new Promise((resolve, reject) => {
  const command = spawn('MP4Box', [
    '-inter', '1000', '-itags', `cover=${outputs[1]}`, outputs[0]
  ])
  command.stderr.on('data', (data) => console.log(`${data}`))
  command.on('error', (err) => {
    term.bold.red('\nSomething went wrong!\nHint: did you remember to install MP4Box?\n')
    reject(err)
  })
  command.on('close', () => {
    resolve(outputs[0])
  })
})

module.exports = interleave
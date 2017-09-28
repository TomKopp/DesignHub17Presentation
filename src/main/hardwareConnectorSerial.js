const path = require('path')
const SerialPort = require('serialport')
const notifyAllBrowserWindows = require(path.join(process.cwd(), 'src', 'main', 'notifyAllBrowserWindows.js'))
const signals = require(path.join(process.cwd(), 'src', 'signals.js'))
const utils = require(path.join(process.cwd(), 'src', 'utils.js'))
const { Readline, Ready } = SerialPort.parsers
// should be in settings
const defaults = {
  port: 'COM9'
  , baudRate: 9600
  , delimiter: '\r\n'
}

module.exports = (options = defaults) => {
  const opts = {}

  Object.assign(
    opts
    , utils.filterByPropertyTypes(defaults, options)
  )

  const port = new SerialPort(opts.port, { baudRate: opts.baudRate })
  const ready = port.pipe(new Ready({ delimiter: 'A' }))
  const parser = ready.pipe(new Readline({ delimiter: opts.delimiter }))

  ready.on('ready', () => {
    port.write(`C${opts.delimiter}`)
  })

  parser.on('data', (data) => {
    // evaluate signals
    // notify ipc listeners on specifig signals like 'playPause', 'next', 'prev'
    if (signals.has(data)) {
      notifyAllBrowserWindows('signal', signals.get(data))
    }
  })
  parser.on('error', (err) => process.stderr.write(err.message))
}

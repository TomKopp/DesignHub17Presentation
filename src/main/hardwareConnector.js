const path = require('path')
const SerialPort = require('serialport')
const notifyAllBrowserWindows = require(path.join(process.cwd(), 'src', 'main', 'notifyAllBrowserWindows.js'))
const utils = require(path.join(process.cwd(), 'src', 'utils.js'))
const { Readline } = SerialPort.parsers
// should be in settings
const defaults = {
  port: 'COM6'
  , baudRate: 9600
  , delimiter: '\r\n'
}
const detectableSignals = [
  'playPause'
  , 'prev'
]
const filterSignal = (signal, arr) => arr.includes(signal)

module.exports = (options = defaults) => {
  const opts = {}

  Object.assign(
    opts
    , utils.filterByPropertyTypes(defaults, options)
  )

  const port = new SerialPort(opts.port, { baudRate: opts.baudRate })
  const parser = new Readline({ delimiter: opts.delimiter })

  port.pipe(parser);
  parser.on('data', (data) => {
    const payload = ''

    // evaluate signals
    // notify ipc listeners on specifig signals like 'playPause', 'next', 'prev'
    if (filterSignal(data, detectableSignals)) {
      notifyAllBrowserWindows(data, payload)
    }
  })
  parser.on('error', (err) => process.stderr.write(err.message))
}

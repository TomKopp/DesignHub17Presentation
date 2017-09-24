const { BrowserWindow } = require('electron')
const path = require('path')
const fs = require('fs')

/**
 * @param {string} URL2Load url that will be loaded in the window
 * @returns {BrowserWindow} returns a new hidden window
 */
module.exports = (URL2Load) => {
  // Create the browser window.
  let win = new BrowserWindow({
    show: false
    , width: 1024
    , height: 768
    , autoHideMenuBar: true
  })

  win.loadURL(URL2Load)

  win.webContents.on('did-finish-load', () => {
    fs.readFile(
      path.join(process.cwd(), 'out', 'styles', 'main.css')
      , 'utf8'
      , (err, data) => {
        if (err) {
          process.stderr.write(err.message)
        } else {
          win.webContents.insertCSS(data)
        }
      }
    )
  })

  win.on('closed', () => {
    win = null
  })

  return win
}

const { BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')

module.exports = () => {
  // Create the browser window.
  let win = new BrowserWindow({
    show: false
    , width: 1024
    , height: 768
    , autoHideMenuBar: true
  })

  // Load the index.html of the app.
  win.loadURL(url.format({
    // pathname: path.join(__dirname, '..', 'views', 'index.html')
    pathname: path.join(__dirname, '..', 'views', 'videoSelection.html')
    // pathname: path.join(__dirname, '..', 'views', 'animationCanvas.html')
    , protocol: 'file:'
    , slashes: true
  }))

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

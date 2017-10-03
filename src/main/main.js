const { app, ipcMain } = require('electron')
const path = require('path')
const urlFormat = require('url').format
// const settings = require('electron-settings')
const { createWindow } = require(path.join(process.cwd(), 'src', 'main', 'helperWindows.js'))
const notifyAllBrowserWindows = require(path.join(process.cwd(), 'src', 'main', 'notifyAllBrowserWindows.js'))
const hardwareConnector = require(path.join(process.cwd(), 'src', 'main', 'hardwareConnectorSerial.js'))
const signals = require(path.join(process.cwd(), 'config', 'signals.js'))

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win = null

const newWindow = () => {
  // const frameURL = urlFormat(path.join(process.cwd(), 'src', 'views', 'index.html'))
  // const frameURL = urlFormat(path.join(process.cwd(), 'src', 'views', 'videoSelection.html'))
  // const frameURL = urlFormat(path.join(process.cwd(), 'src', 'views', 'animationCanvas.html'))
  const frameURL = urlFormat(path.join(process.cwd(), 'src', 'views', 'animatedTrace.html'))

  win = createWindow(frameURL)
  win.once('ready-to-show', () => {
    win.show()
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', newWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    newWindow()
  }
})

ipcMain.on('signal', (event, message) => {
  if (signals.has(message)) {
    notifyAllBrowserWindows('signal', signals.get(message))
  }
})


hardwareConnector()

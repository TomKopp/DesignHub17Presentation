const { app } = require('electron')
const path = require('path')
const url = require('url')
// const settings = require('electron-settings')
const newWindow = require(path.join(process.cwd(), 'src', 'main', 'createWindow.js'))
const hardwareConnector = require(path.join(process.cwd(), 'src', 'main', 'hardwareConnector.js'))

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win = null

const createWindow = () => {
  const frameURL = path.join(process.cwd(), 'src', 'views', 'index.html')
  // const frameURL = path.join(process.cwd(), 'src', 'views', 'videoSelection.html')
  // const frameURL = path.join(process.cwd(), 'src', 'views', 'animationCanvas.html')

  win = newWindow(url.format(frameURL))
  win.once('ready-to-show', () => {
    win.show()
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

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
    createWindow()
  }
})


hardwareConnector()

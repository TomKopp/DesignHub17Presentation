const { app, Menu } = require('electron')
// const settings = require('electron-settings')
const path = require('path')
const mainWindow = require(path.join(__dirname, 'mainWindow.js'))

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Context menu
const contextMenu = Menu.buildFromTemplate([
  {
    label: 'DevTools'
    , click: () => win.webContents.openDevTools()
  }
])

const createWindow = () => {
  win = mainWindow()
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

// Add context menu to window
app.on('browser-window-created', (event, win) => {
  win.webContents.on('context-menu', (e, params) => {
    contextMenu.popup(win, params.x, params.y)
  })
})

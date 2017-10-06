const { app, ipcMain } = require('electron')
const { join } = require('path')
const { format } = require('url')
// const settings = require('electron-settings')
const { createWindow, broadcastMsg } = require(join(process.cwd(), 'src', 'main', 'helperWindows.js'))
const hardwareConnector = require(join(process.cwd(), 'src', 'main', 'hardwareConnectorSerial.js'))
const signals = require(join(process.cwd(), 'config', 'signals.js'))
const stylingVars = require(join(process.cwd(), 'config', 'styling-variables.js'))

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win = null

const newWindow = () => {
	// const frameURL = format(join(process.cwd(), 'src', 'views', 'index.html'))
	// const frameURL = format(join(process.cwd(), 'src', 'views', 'videoSelection.html'))
	// const frameURL = format(join(process.cwd(), 'src', 'views', 'animationCanvas.html'))
	const frameURL = format(join(process.cwd(), 'src', 'views', 'animatedTrace.html'))

	win = createWindow(frameURL, { backgroundColor: stylingVars['background-color-dark'] })
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
		broadcastMsg('signal', signals.get(message))
	}
})


hardwareConnector()

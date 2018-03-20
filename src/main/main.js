const { app, ipcMain } = require('electron');
const { join } = require('path');
const { format } = require('url');
// const settings = require('electron-settings')
const { createWindow, broadcastMsg } = require(join(process.cwd(), 'src', 'main', 'helperWindows.js'));
// const hardwareConnector = require(join(process.cwd(), 'src', 'main', 'hardwareConnectorSerial.js'));
const signals = require(join(process.cwd(), 'config', 'signals.js'));
const stylingVars = require(join(process.cwd(), 'config', 'styling-variables.js'));

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win = null;

const newWindow = () => {
	const frameURL = format(join('file:///', process.cwd(), 'src', 'views', 'index.html'));

	win = createWindow(frameURL, { backgroundColor: stylingVars['background-color-dark'], frame: false, fullscreen: true });
	win.once('ready-to-show', () => {
		win.show();
	});
};

app.on('ready', newWindow);
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
app.on('activate', () => {
	if (win === null) {
		newWindow();
	}
});

ipcMain.on('signal', (event, message) => {
	if (signals.has(message)) {
		broadcastMsg('signal', signals.get(message));
	}
});


// hardwareConnector();

const electron = require('electron')
const { join } = require('path')
const { readFile } = require('fs')

// Origin of coordinates
const oOC = {
	x: 0
	, y: 0
}

// @TODO - move to settings
const optsBrowserWindow = {
	show: false
	, width: 1024
	, height: 768
	, autoHideMenuBar: true
}

/**
 * Filter all displays for externals ones
 * @param  {screen} screen electron's screen instance
 * @return {Display[]} filtered array of displays
 */
const getExternalDisplays = (screen) => screen.getAllDisplays().filter((el) => el.bounds.x !== oOC.x || el.bounds.y !== oOC.y)

/**
 * Gets the maximal bounds for a frame across all external screens
 * @param  {Display[]} externalDisplays array of displays from screen.getAllDisplays()
 * @return {Rect} rectangle obj with max bounds
 */
const getExternalBounds = (externalDisplays) => externalDisplays
	.map((el) => el.bounds)
	.reduce((carry, el) => ({
		x: Math.min(carry.x, el.x)
		, y: Math.min(carry.y, el.y)
		, height: carry.x === el.x
			? carry.height + el.height
			: Math.min(carry.height, el.height)
		, width: carry.y === el.y
			? carry.width + el.width
			: Math.min(carry.width, el.width)
	}))

/**
 * Create a new hidden browser window.
 *
 * @param {string} Url2Load url that will be loaded in the window
 * @param {Object} options BrowserWindows options
 * @returns {BrowserWindow} returns a new hidden window
 */
const createWindow = (Url2Load, options) => {
	let win = new electron.BrowserWindow(Object.assign({}, optsBrowserWindow, options))

	win.loadURL(Url2Load)

	// win.webContents.on('did-finish-load', () => {
	// 	readFile(
	// 		join(process.cwd(), 'node_modules', 'material-components-web', 'dist', 'material-components-web.css')
	// 		, 'utf8'
	// 		, (err, data) => {
	// 			if (err) {
	// 				process.stderr.write(err.message)
	// 			} else {
	// 				win.webContents.insertCSS(data)
	// 			}
	// 		}
	// 	)
	// 	readFile(
	// 		join(process.cwd(), 'out', 'styles', 'styles.css')
	// 		, 'utf8'
	// 		, (err, data) => {
	// 			if (err) {
	// 				process.stderr.write(err.message)
	// 			} else {
	// 				win.webContents.insertCSS(data)
	// 			}
	// 		}
	// 	)
	// })

	win.on('closed', () => {
		win = null
	})

	return win
}

/**
 * Create a new browser window, that spanns across multiple screens.
 *
 * @param {string} Url2Load url that will be loaded in the window
 * @param {Object} options BrowserWindows options
 * @returns {BrowserWindow} returns a new hidden window
 */
const createWindowMultiScreen = (Url2Load, options) => {

	const externalBounds = getExternalBounds(getExternalDisplays(electron.screen))

	const opts = {
		frame: false
		, bounds: { height: externalBounds.height, width: externalBounds.width, x: 0, y: 0 }
	}

	return createWindow(
		Url2Load
		, Object.assign(
			options
			, opts
		)
	)
}

/**
 * Notifys all BrowserWindows
 * @param {string} event chanel to send the message to
 * @param {string} message message to send
 * @returns {@function} notifys all BrowserWindows
 */
const broadcastMsg = (event, message) => {
	electron.BrowserWindow.getAllWindows().forEach((win) => {
		win.webContents.send(event, message)
	})
}


module.exports = Object.freeze({
	createWindow
	, createWindowMultiScreen
	, broadcastMsg
})

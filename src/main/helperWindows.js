const { BrowserWindow, screen } = require('electron')
const path = require('path')
const fs = require('fs')

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
		, height: el.x === oOC.x
			? carry.height + el.height
			: Math.min(carry.height, el.height)
		, width: el.y === oOC.y
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
	let win = new BrowserWindow(Object.assign({}, optsBrowserWindow, options))

	win.loadURL(Url2Load)

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

/**
 * Create a new browser window, that spanns across multiple screens.
 *
 * @param {string} Url2Load url that will be loaded in the window
 * @param {Object} options BrowserWindows options
 * @returns {BrowserWindow} returns a new hidden window
 */
const createWindowMultiScreen = (Url2Load, options) => {

	/*
	const displays = screen.getAllDisplays()
	const primDisp = screen.getPrimaryDisplay()
	let { height, width, x, y } = primDisp.bounds
	const externalDisplay = []

	for (const i in displays) {
	  if (displays[i].bounds.x !== 0 || displays[i].bounds.y !== 0) {
	    externalDisplay.push(displays[i])
	  }
	}

	if (externalDisplay[0]) {
	  const bounds = externalDisplay[0].bounds

	  if (bounds.x != 0) {
	    height = Math.min(height, bounds.height)
	    width += bounds.width
	  }
	  if (bounds.y != 0) {
	    height += bounds.height
	    width = Math.min(width, bounds.width)
	  }
	}

	win.setBounds({ height, width, x, y })
	*/

	const externalBounds = getExternalBounds(getExternalDisplays(screen))

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
	BrowserWindow.getAllWindows().forEach((win) => {
		win.webContents.send(event, message)
	})
}


module.exports = Object.freeze({
	createWindow
	, createWindowMultiScreen
	, broadcastMsg
})

const { BrowserWindow } = require('electron')

/**
 * @param {string} event chanel to send the message to
 * @param {string} message message to send
 * @returns {function} notify all BrowserWindows
 */
module.exports = (event, message) => {
  BrowserWindow.getAllWindows().forEach((win) => {
    win.webContents.send(event, message)
  })
}

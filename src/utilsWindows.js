/* eslint max-statements: "off" */
module.exports = (() => {
  const createMultiScreenWindow = (screen, win) => {
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

    win.setBounds({
      height
      , width
      , x
      , y
    })
  }

  return Object.freeze({ createMultiScreenWindow })
})()

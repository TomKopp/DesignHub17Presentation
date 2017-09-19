/* eslint no-magic-numbers: "off" */
const { remote, screen } = require('electron')
const h = require('hyperscript')
const path = require('path')
const url = require('url')
const newWindow = remote.require(path.join(process.cwd(), 'src', 'main', 'createWindow.js'))
const stylingVars = require(path.join(process.cwd(), 'config', 'styling-variables.js'))
const utilsAnimation = require(path.join(process.cwd(), 'src', 'utilsAnimation.js'))

const winSize = remote.getCurrentWindow().getContentSize()
const winSizeWidth = 0
const winSizeHeight = 1
const canvas = h('canvas#animationCanvas', { width: winSize[winSizeWidth], height: winSize[winSizeHeight] }, 'Sorry no canvas to draw on.')
const ctx = canvas.getContext('2d')
const MyGame = { isRunning: false }
const ball = utilsAnimation.createDot(10, 10, 20, stylingVars['background-color-light'])

document.getElementById('mainAnimationContainer').appendChild(canvas)

let vx = 5
let vy = 1
const update = (tFrame) => {
  ball.x += vx
  ball.y += vy

  if (ball.y + vy > canvas.height || ball.y + vy < 0) {
    vy = -vy;
  }
  if (ball.x + vx > canvas.width || ball.x + vx < 0) {
    vx = -vx;
  }
}

const render = () => {
  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = stylingVars['background-color-animation-dark']
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ball.draw(ctx)
}

const main = (tFrame) => {
  MyGame.raf = window.requestAnimationFrame(main)
  MyGame.isRunning = true

  // Call your update method. In our case, we give it rAF's timestamp.
  update(tFrame)
  render()
}

// Start the cycle
canvas.addEventListener('click', () => {
  if (!MyGame.isRunning) {
    main()
  }
})


// Open video window
const displays = screen.getAllDisplays()
const win = newWindow(url.format(path.join(process.cwd(), 'src', 'views', 'videoWindow.html')))
let externalDisplay = null

for (const i in displays) {
  if (displays[i].bounds.x !== 0 || displays[i].bounds.y !== 0) {
    externalDisplay = displays[i]
    break
  }
}

if (externalDisplay) {
  win.setBounds({ x: externalDisplay.bounds.x, y: externalDisplay.bounds.y, width: 1024, height: 768 })
}

win.setFullScreen(true)
win.showInactive()

const { remote } = require('electron')
const path = require('path')
// const url = require('url')
// const fs = require('fs')
const h = require('hyperscript')
const stylingVars = require(path.join(process.cwd(), 'config', 'styling-variables.js'))
const utilsAnimation = require('./../utilsAnimation.js')

// const { Browserwindow } = remote
const winSize = remote.getCurrentWindow().getContentSize()
const canvas = h('canvas#animationCanvas', { width: winSize[0], height: winSize[1] }, 'Sorry no canvas to draw on.')
const MyGame = {}
const ctx = canvas.getContext('2d')
const ball = utilsAnimation.createDot(10, 10, 20, stylingVars['background-color-light'])

document.getElementById('mainAnimationContainer').appendChild(canvas)

const update = (tFrame) => {
  let vx = 5
  let vy = 1

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

(() => {
  const main = (tFrame) => {
    MyGame.raf = window.requestAnimationFrame(main)

    // Call your update method. In our case, we give it rAF's timestamp.
    update(tFrame)
    render()
  }

  // Start the cycle
  main()
})()


// Open video window

// var electronScreen = electron.screen
// var displays = electronScreen.getAllDisplays()
// var externalDisplay = null
// var win;

// for (var i in displays) {
//   if (displays[i].bounds.x != 0 || displays[i].bounds.y != 0) {
//     externalDisplay = displays[i];
//     break;
//   }
// }

// if (externalDisplay) {
//   win = new BrowserWindow({
//     x: externalDisplay.bounds.x + 50,
//     y: externalDisplay.bounds.y + 50
//   });
// }
// // let win = new Browserwindow({
// //   fullscreen: true
// //   , autoHideMenuBar: true
// // })

// win.loadURL(url.format(path.join(__dirname, '..', 'views', 'videoWindow.html')))
// win.webContents.on('did-finish-load', () => {
//   fs.readFile(
//     path.join(process.cwd(), 'out', 'styles', 'main.css')
//     , 'utf8'
//     , (err, data) => {
//       if (err) {
//         process.stderr.write(err.message)
//       } else {
//         win.webContents.insertCSS(data)
//       }
//     }
//   )
// })

// win.on('closed', () => {
//   win = null
// })

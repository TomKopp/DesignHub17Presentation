const { remote } = require('electron')
const path = require('path')
const h = require('hyperscript')
const stylingVars = require(path.join(process.cwd(), 'config', 'styling-variables.js'))
const utilsAnimation = require('./../utilsAnimation.js')

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

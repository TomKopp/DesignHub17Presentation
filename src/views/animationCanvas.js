/* eslint no-magic-numbers: "off" */
const { remote, screen } = require('electron')
const h = require('hyperscript')
const path = require('path')
const url = require('url')
const newWindow = remote.require(path.join(process.cwd(), 'src', 'main', 'createWindow.js'))
const stylingVars = require(path.join(process.cwd(), 'config', 'styling-variables.js'))
const utilsAnimation = require(path.join(process.cwd(), 'src', 'utilsAnimation.js'))

const win = remote.getCurrentWindow()

win.setFullScreen(true)

const [
  winContentSizeWidth
  , winContentSizeHeight
] = win.getContentSize()
// projectionWidth in meter
const projectionWidth = 4
// projectionHeight in meter
const projectionHeight = 2.25
const widthCoefficient = winContentSizeWidth / projectionWidth
const heightCoefficient = winContentSizeHeight / projectionHeight

const canvas = h('canvas#animationCanvas', { width: winContentSizeWidth, height: winContentSizeHeight }, 'Sorry no canvas to draw on.')

const csv = require('fast-csv')
let myArray = []
let avgZ = null

csv
  .fromPath(path.join(process.cwd(), 'assets', 'Testdaten Kinect Tanzen.csv'), { trim: true, ignoreEmpty: true })
  .transform((data) => [
    parseFloat(data[0])
    , parseFloat(data[2])
  ])
  .on('data', (data) => {
    myArray.push(data)
    // process.stdout(data)
  })
  .on('end', () => {
    // process.stdout('done')
    avgZ = myArray.reduce((carry, curr) => carry + curr[1], 0) / myArray.length

    myArray = myArray.map((val) => [
      val[0] * widthCoefficient + winContentSizeWidth / 2
      , (val[1] - avgZ) * heightCoefficient + winContentSizeHeight / 2
    ])


    const ctx = canvas.getContext('2d')
    const MyTrace = utilsAnimation.createTrace(myArray, ctx, stylingVars['animation-trace-color-default'])

    document.getElementById('mainAnimationContainer').appendChild(canvas)


    const update = (tFrame) => {
      // const nextTick = MyTrace.lastTick + MyTrace.tickLength

      if (tFrame - MyTrace.lastTick > MyTrace.tickLength) {
        MyTrace.update()
        MyTrace.lastTick = tFrame
      }
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      MyTrace.render()
    }

    const main = (tFrame) => {
      MyTrace.rAF = window.requestAnimationFrame(main)

      update(tFrame)
      render()
    }

    canvas.addEventListener('click', () => {
      if (MyTrace.isRunning) {
        window.cancelAnimationFrame(MyTrace.rAF)
        MyTrace.isRunning = false
      } else {
        MyTrace.isRunning = true
        MyTrace.lastTick = performance.now()
        main(performance.now())
      }
    })
  })


// let vx = 5
// let vy = 1
// const update = (tFrame) => {
//   ball.x += vx
//   ball.y += vy

//   if (ball.y + vy > canvas.height || ball.y + vy < 0) {
//     vy = -vy;
//   }
//   if (ball.x + vx > canvas.width || ball.x + vx < 0) {
//     vx = -vx;
//   }
// }

// const render = () => {
//   // ctx.clearRect(0, 0, canvas.width, canvas.height);
//   ctx.fillStyle = stylingVars['animation-background-color-dark']
//   ctx.fillRect(0, 0, canvas.width, canvas.height)
//   ball.draw(ctx)
// }

// const main = (tFrame) => {
//   MyTrace.raf = window.requestAnimationFrame(main)
//   MyTrace.isRunning = true

//   // Call your update method. In our case, we give it rAF's timestamp.
//   update(tFrame)
//   render()
// }

// Start the cycle
// canvas.addEventListener('click', () => {
//   if (!MyTrace.isRunning) {
//     main()
//   }
// })


// // Open video window
// const displays = screen.getAllDisplays()
// const videoWindow = newWindow(url.format(path.join(process.cwd(), 'src', 'views', 'videoWindow.html')))
// let externalDisplay = null

// for (const i in displays) {
//   if (displays[i].bounds.x !== 0 || displays[i].bounds.y !== 0) {
//     externalDisplay = displays[i]
//     break
//   }
// }

// if (externalDisplay) {
//   videoWindow.setBounds({ x: externalDisplay.bounds.x, y: externalDisplay.bounds.y, width: 1024, height: 768 })
// }

// videoWindow.setFullScreen(true)
// videoWindow.showInactive()

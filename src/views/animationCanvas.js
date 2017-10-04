/* eslint no-magic-numbers: "off" */
const { remote, screen, ipcRenderer } = require('electron')
const h = require('hyperscript')
const path = require('path')
const url = require('url')
const newWindow = remote.require(path.join(process.cwd(), 'src', 'main', 'createWindow.js'))
const signals = require(path.join(process.cwd(), 'src', 'signals.js'))
const stylingVars = require(path.join(process.cwd(), 'config', 'styling-variables.js'))
const utilsAnimation = require(path.join(process.cwd(), 'src', 'utilsAnimation.js'))
const utilsWindows = require(path.join(process.cwd(), 'src', 'utilsWindows.js'))

const win = remote.getCurrentWindow()

// win.setFullScreen(true)
utilsWindows.createMultiScreenWindow(screen, win)

// Open windown on second screen
// const displays = screen.getAllDisplays()
// let externalDisplay = null
// for (const i in displays) {
//   if (displays[i].bounds.x !== 0 || displays[i].bounds.y !== 0) {
//     externalDisplay = displays[i]
//     break
//   }
// }
// if (externalDisplay) {
// win.setBounds({
//   x: externalDisplay.bounds.x
//   , y: externalDisplay.bounds.y
//   , width: externalDisplay.bounds.width
//   , height: externalDisplay.bounds.height
// })
// }

const [
	winContentSizeWidth
	, winContentSizeHeight
] = win.getContentSize()
// projectionWidth in meter
// const projectionWidth = 4
const projectionWidth = 3
// projectionHeight in meter
// const projectionHeight = 2.25
const projectionHeight = 1.75
const widthCoefficient = winContentSizeWidth / projectionWidth
const heightCoefficient = winContentSizeHeight / projectionHeight

const canvas = h('canvas#animationCanvas', { width: winContentSizeWidth, height: winContentSizeHeight }, 'Sorry no canvas to draw on.')

const csv = require('fast-csv')
let myArray = []
let avgZ = null

const buildTraceCoords = () => {
	avgZ = myArray.reduce((carry, curr) => carry + curr[1], 0) / myArray.length

	myArray = myArray.map((val) => [
		val[0] * widthCoefficient + winContentSizeWidth / 2
		, (val[1] - avgZ) * heightCoefficient + winContentSizeHeight / 2
	])
}

csv
	// .fromPath(path.join(process.cwd(), 'assets', 'Testdaten Kinect Tanzen.csv'), { trim: true, ignoreEmpty: true })
	.fromPath(path.join(process.cwd(), 'assets', 'danceData.csv'), { delimiter: ';', trim: true, ignoreEmpty: true })
	.transform((data) => [
		// parseFloat(data[0])
		// , parseFloat(data[2])
		parseFloat(data[1].replace(/,/g,'.'))
		, parseFloat(data[3].replace(/,/g, '.'))
	])
	.on('data', (data) => {
		myArray.push(data)
		// process.stdout(data)
	})
	.on('end', () => {
		// process.stdout('done')

		buildTraceCoords()

		const ctx = canvas.getContext('2d')
		const MyTrace = utilsAnimation.createTrace(myArray, ctx, stylingVars['animation-trace-color-default'])

		document.getElementById('mainAnimationContainer').appendChild(canvas)


		const update = (tFrame) => {
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

		const playPause = () => {
			if (MyTrace.isRunning) {
				window.cancelAnimationFrame(MyTrace.rAF)
				MyTrace.isRunning = false
			} else {
				MyTrace.isRunning = true
				MyTrace.lastTick = performance.now()
				main(performance.now())
			}
		}

		canvas.addEventListener('click', () => ipcRenderer.send('signal', 'playPause'))

		ipcRenderer.on('signal', (event, message) => {
			if (signals.get('playPause') === message) {
				playPause()
			}
			console.log(message)
		})
	})


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

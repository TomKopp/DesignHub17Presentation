/* eslint no-magic-numbers: "off" */
const { remote, screen, ipcRenderer } = require('electron')
const h = require('hyperscript')
const csv = require('fast-csv')
const { join } = require('path')
// const { format } = require('url')
// const { createWindowMultiScreen, broadcastMsg } = require(join(process.cwd(), 'src', 'main', 'helperWindows.js'))
const signals = require(join(process.cwd(), 'config', 'signals.js'))
const stylingVars = require(join(process.cwd(), 'config', 'styling-variables.js'))
const utilsAnimation = require(join(process.cwd(), 'src', 'utils', 'utilsAnimation.js'))

const win = remote.getCurrentWindow()

// utilsWindows.createMultiScreenWindow(screen, win)

// @TODO - move to settings
const optsCsv = {
	delimiter: ';'
	, trim: true
	, ignoreEmpty: true
}

const [
	winContentSizeWidth
	, winContentSizeHeight
] = win.getContentSize()
// let traceData = []
const dancePaths = new Map()

const normalizeDancePaths = (dancePathsMap) => {
	// projectionWidth in meter @TODO - move to settings
	const projectionWidth = 3
	// projectionHeight in meter @TODO - move to settings
	const projectionHeight = 1.75
	const widthCoefficient = winContentSizeWidth / projectionWidth
	const heightCoefficient = winContentSizeHeight / projectionHeight
	let avg = 0
	let numberOfElements = 0

	dancePathsMap.forEach((val) => {
		avg += val.reduce((carry, curr) => carry + curr[1], 0)
		numberOfElements += val.length
	})
	avg /= numberOfElements
	dancePathsMap.forEach((val) => {
		val.forEach(([x, z], i, arr) => {
			arr[i] = [
				x * widthCoefficient + winContentSizeWidth / 2
				, (z - avg) * heightCoefficient + winContentSizeHeight / 2
			]
		})
	})
}

const canvas = h(
	'canvas#animationCanvas'
	, { width: winContentSizeWidth, height: winContentSizeHeight }
	, 'Sorry no canvas to draw on.'
)

document.getElementById('mainAnimationContainer').appendChild(canvas)

csv
	.fromPath(join(process.cwd(), 'assets', 'danceData.csv'), optsCsv)
	.transform((data) => [
		data[0]
		, parseFloat(data[1].replace(/,/g, '.'))
		, parseFloat(data[3].replace(/,/g, '.'))
		, data[4]
	])
	.on('data', ([
		dancerId
		, xCoord
		, zCoord
		, timestamp
	]) => {
		if (dancePaths.has(dancerId) === false) {
			dancePaths.set(dancerId, [])
		}
		dancePaths.get(dancerId).push([
			xCoord
			, zCoord
			, timestamp
		])
	})
	.on('end', () => {
		normalizeDancePaths(dancePaths)

		// const ctx = canvas.getContext('2d')
		// make new canvas for each dancer
		// like a new layer for each dancer
	})

// const buildTraceCoords = () => {
// 	const avgDepth = traceData.reduce((carry, curr) => carry + curr[1], 0) / traceData.length

// 	traceData = traceData.map((val) => [
// 		val[0] * widthCoefficient + winContentSizeWidth / 2
// 		, (val[1] - avgDepth) * heightCoefficient + winContentSizeHeight / 2
// 	])
// }

// csv
// 	// .fromPath(join(process.cwd(), 'assets', 'Testdaten Kinect Tanzen.csv'), { trim: true, ignoreEmpty: true })
// 	.fromPath(join(process.cwd(), 'assets', 'danceData.csv'), { delimiter: ';', trim: true, ignoreEmpty: true })
// 	.transform((data) => [
// 		// parseFloat(data[0])
// 		// , parseFloat(data[2])
// 		parseFloat(data[1].replace(/,/g, '.'))
// 		, parseFloat(data[3].replace(/,/g, '.'))
// 	])
// 	.on('data', (data) => {
// 		traceData.push(data)
// 		// process.stdout(data)
// 	})
// 	.on('end', () => {
// 		// process.stdout('done')

// 		buildTraceCoords()

// 		const ctx = canvas.getContext('2d')
// 		const MyTrace = utilsAnimation.createTrace(traceData, ctx, stylingVars['animation-trace-color-default'])

// 		// document.getElementById('mainAnimationContainer').appendChild(canvas)


// 		const update = (tFrame) => {
// 			if (tFrame - MyTrace.lastTick > MyTrace.tickLength) {
// 				MyTrace.update()
// 				MyTrace.lastTick = tFrame
// 			}
// 		}

// 		const render = () => {
// 			ctx.clearRect(0, 0, canvas.width, canvas.height)
// 			MyTrace.render()
// 		}

// 		const main = (tFrame) => {
// 			MyTrace.rAF = window.requestAnimationFrame(main)

// 			update(tFrame)
// 			render()
// 		}

// 		const playPause = () => {
// 			if (MyTrace.isRunning) {
// 				window.cancelAnimationFrame(MyTrace.rAF)
// 				MyTrace.isRunning = false
// 			} else {
// 				MyTrace.isRunning = true
// 				MyTrace.lastTick = performance.now()
// 				main(performance.now())
// 			}
// 		}

// 		canvas.addEventListener('click', () => ipcRenderer.send('signal', 'playPause'))

// 		ipcRenderer.on('signal', (event, message) => {
// 			if (signals.get('playPause') === message) {
// 				playPause()
// 			}
// 			console.log(message)
// 		})
// 	})

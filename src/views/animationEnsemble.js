
const { remote, ipcRenderer } = require('electron')
const h = require('hyperscript')
const csv = require('fast-csv')
const { join } = require('path')
const { Rekapi, Actor } = require('rekapi')
const signals = require(join(process.cwd(), 'config', 'signals.js'))

// @TODO - move to settings
const optsCsv = {
	delimiter: ';'
	, trim: true
	, ignoreEmpty: true
}

const win = remote.getCurrentWindow()
const [
	winContentSizeWidth
	, winContentSizeHeight
] = win.getContentSize()
const canvas = h(
	'canvas#animationCanvas'
	, { width: winContentSizeWidth, height: winContentSizeHeight }
	, 'Sorry no canvas to draw on.'
)
const dancers = new Map()
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

// @TODO - move to utils
const rekapi = new Rekapi(canvas.getContext('2d'))
const createActor = () => new Actor({
	render: (ctx, state) => {
		ctx.beginPath()
		ctx.arc(state.x, state.y, 20, 0, Math.PI * 2, true)
		ctx.closePath()
		ctx.fillStyle = '#fff'
		ctx.fill()
	}
})

document.getElementById('mainAnimationContainer').appendChild(canvas)

// @TODO - capsel into getTrace()
csv
	.fromPath(join(process.cwd(), 'assets', 'danceData.csv'), optsCsv)
	.transform(([
		dancerId
		, xCoord
		, yCoord
		, zCoord
		, timestamp
	]) => [
		dancerId
		, parseFloat(xCoord.replace(/,/g, '.'))
		, parseFloat(zCoord.replace(/,/g, '.'))
		, timestamp
	])
	.on('data', ([
		dancerId
		, xCoord
		, zCoord
		, timestamp
	]) => {
		// if (dancers.has(dancerId) === false) {
		// 	dancers.set(dancerId, createActor())
		// }
		// dancers.get(dancerId).keyframe(timestamp, {
		// 	x: xCoord
		// 	, y: zCoord
		// })
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

		dancePaths.forEach((path, key) => {
			if (dancers.has(key) === false) {
				dancers.set(key, createActor())
			}
			dancers.get(key).keyframe(path[2], { x: path[0], y: path[1] })
		})
		dancers.forEach((dancer) => {
			rekapi.addActor(dancer)
		})
	})

const playPause = () => {
	if (rekapi.isPaused()) {
		rekapi.play()
	} else {
		rekapi.pause()
	}
}

ipcRenderer.on('signal', (event, message) => {
	if (signals.get('playPause') === message) {
		playPause()
	}
	console.log(message)
})

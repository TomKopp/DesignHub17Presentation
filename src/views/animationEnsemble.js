
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
	, {
		width: winContentSizeWidth
		, height: winContentSizeHeight
		, onclick() {
			ipcRenderer.send('signal', 'playPause')
		}
	}
	, 'Sorry no canvas to draw on.'
)
const dancers = new Map()
const dancePaths = new Map()
let firstTimeStamp = null

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
		val.forEach(([x, z, timestamp], i, arr) => {
			let time = 0

			if (firstTimeStamp === null) {
				firstTimeStamp = timestamp
			} else {
				time = timestamp - firstTimeStamp
			}

			arr[i] = [
				x * widthCoefficient + winContentSizeWidth / 2
				, (z - avg) * heightCoefficient + winContentSizeHeight / 2
				, time
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
		, parseFloat(timestamp.replace(/,/g, '.'))
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

		dancePaths.forEach((path, key) => {
			if (dancers.has(key) === false) {
				dancers.set(key, createActor())
			}
			const bla = dancers.get(key)

			path.forEach(([x, y, timestamp]) => {
				if (bla.hasKeyframeAt(timestamp) === false) {
					bla.keyframe(timestamp, { x, y })
				}
			})
		})
		dancers.forEach((dancer) => {
			rekapi.addActor(dancer)
		})
	})

const playPause = () => {
	if (rekapi.isPlaying()) {
		rekapi.pause()
	} else {
		rekapi.play()
	}
}

ipcRenderer.on('signal', (event, message) => {
	if (signals.get('playPause') === message) {
		playPause()
	}
	console.log(message)
})

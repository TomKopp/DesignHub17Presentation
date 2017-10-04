const { remote, ipcRenderer } = require('electron')
const h = require('hyperscript')
const path = require('path')
const url = require('url')
const signals = require(path.join(process.cwd(), 'src', 'signals.js'))
const winSize = remote.getCurrentWindow().getContentSize()
const winSizeWidth = 0
const winSizeHeight = 1

const playPause = (video) => {
	if (video.paused) {
		video.play()
	} else {
		video.pause()
	}
}

const video = h(
	'video.media'
	, {
		src: url.format(path.join(process.cwd(), 'assets', 'video.mp4'))
		, width: winSize[winSizeWidth]
		, height: winSize[winSizeHeight]
		, controls: true
		, onclick() {
			ipcRenderer.send('signal', 'playPause')
		}
	}, 'Sorry, no video.'
)

document.getElementById('mainVideoContainer').appendChild(video)

ipcRenderer.on('signal', (event, message) => {
	if (signals.get('playPause') === message) {
		playPause(video)
	}
	if (signals.get('next') === message) {
		video.currentTime += 3
	}
	if (signals.get('prev') === message) {
		video.currentTime -= 3
	}
	console.log(message)
})

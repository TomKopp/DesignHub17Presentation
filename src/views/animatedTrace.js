const { remote, ipcRenderer } = require('electron')
const h = require('hyperscript')
const { join } = require('path')
const { format } = require('url')
const signals = require(join(process.cwd(), 'config', 'signals.js'))
// const { createWindowMultiScreen, broadcastMsg } = require(join(process.cwd(), 'src', 'main', 'helperWindows.js'))

const [
	winContentSizeWidth
	, winContentSizeHeight
] = remote.getCurrentWindow().getContentSize()

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
		src: format(join(process.cwd(), 'assets', 'beamershow.mp4'))
		, width: winContentSizeWidth
		, height: winContentSizeHeight
		, controls: false
		, onclick() {
			ipcRenderer.send('signal', 'playPause')
		}
		, ondblclick() {
			ipcRenderer.send('signal', 'next')
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

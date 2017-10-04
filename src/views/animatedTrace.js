const { remote, screen, ipcRenderer } = require('electron')
const h = require('hyperscript')
const path = require('path')
const url = require('url')
const newWindow = remote.require(path.join(process.cwd(), 'src', 'main', 'createWindow.js'))
const signals = require(path.join(process.cwd(), 'src', 'signals.js'))
const utilsWindows = require(path.join(process.cwd(), 'src', 'utilsWindows.js'))
const win = remote.getCurrentWindow()

utilsWindows.createMultiScreenWindow(screen, win)

const contentSize = win.getContentSize()
const contentWidth = 0
const contentHeight = 1

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
		src: url.format(path.join(process.cwd(), 'assets', 'beamershow.mp4'))
		, width: contentSize[contentWidth]
		, height: contentSize[contentHeight]
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

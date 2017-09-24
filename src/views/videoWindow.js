const { remote, ipcRenderer } = require('electron')
const h = require('hyperscript')
const path = require('path')
const url = require('url')
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
      if (this.paused) {
        this.play()
      } else {
        this.pause()
      }
    }
  }, 'Sorry, no video.'
)

document.getElementById('mainVideoContainer').appendChild(video)


ipcRenderer.on('playPause', (event, message) => {
  playPause(video)
  console.log(`${message}: playPause`)
})
ipcRenderer.on('prev', (event, message) => {
  // previous menu item
  console.log(`${message}: prev`)
})
ipcRenderer.on('next', (event, message) => {
  // next menu item
  console.log(`${message}: next`)
})

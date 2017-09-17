const { remote } = require('electron')
const h = require('hyperscript')
const path = require('path')
const url = require('url')
const winSize = remote.getCurrentWindow().getContentSize()

const video = h(
  'video.media'
  , {
    src: url.format(path.join(process.cwd(), 'assets', 'video.mp4'))
    , width: winSize[0]
    , height: winSize[1]
    , controles: true
    , onclick () {
      if (this.paused) {
        this.play()
      } else {
        this.pause()
      }
    }
  }, 'Sorry, no video.'
)

document.getElementById('mainAnimationContainer').appendChild(video)

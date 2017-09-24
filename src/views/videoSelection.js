const { ipcRenderer } = require('electron')
const h = require('hyperscript')
const path = require('path')
const url = require('url')

// @TODO: load from config
const mainSelection = [
  {
    label: 'LAND OF ALL'
    , sublabel: 'contemporary dance - MN DANCE COMPANY'
    , media: url.format(path.join(process.cwd(), 'assets', 'video.mp4'))
    , resource: url.format(path.join(process.cwd(), 'src', 'views', 'animationCanvas.html'))
  }
  , {
    label: 'A Great Big World- Say Something'
    , sublabel: 'Contemporary Dance Auti Kamal x Matt Sagisi & Caitlin Barfield'
    , media: url.format(path.join(process.cwd(), 'assets', 'video.mp4'))
    , resource: url.format(path.join(process.cwd(), 'src', 'views', 'animationCanvas.html'))
  }
  , {
    label: 'A Great Big World- Say Something'
    , sublabel: 'Contemporary Dance TUTORIAL @autikamaln'
    , media: url.format(path.join(process.cwd(), 'assets', 'video.mp4'))
    , resource: url.format(path.join(process.cwd(), 'src', 'views', 'animationCanvas.html'))
  }
]

const parent = document.getElementById('main-selection')
const ul = h('ul.list-media-object')

mainSelection.forEach((menuItem) => {
  const li = h(
    'li.media-object'
    , h(
      'video.media-figure'
      , {
        src: menuItem.media
        , width: 150
        , height: 100
        , muted: true
        , loop: true
        , playbackRate: 3
        , onmousedown() {
          this.play()
        }
        , onmouseup() {
          this.pause()
        }
      }, 'Sorry, no video.'
    )
    , h(
      'a.media-body'
      , { href: menuItem.resource }
      , h('h2.label', menuItem.label)
      , h('p.sublabel', menuItem.sublabel)
    )
  )

  ul.appendChild(li)
})

parent.appendChild(ul)


ipcRenderer.on('playPause', (event, message) => {
  // select menu item
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

const h = require('hyperscript')
const path = require('path')
const url = require('url')

// @TODO: load from config
const mainSelection = [
  {
    label: 'LAND OF ALL'
    , sublabel: 'contemporary dance - MN DANCE COMPANY'
    , media: url.format(path.join(process.cwd(), 'assets', 'video.mp4'))
  }
  , {
    label: 'A Great Big World- Say Something'
    , sublabel: 'Contemporary Dance Auti Kamal x Matt Sagisi & Caitlin Barfield'
    , media: url.format(path.join(process.cwd(), 'assets', 'video.mp4'))
  }
  , {
    label: 'A Great Big World- Say Something'
    , sublabel: 'Contemporary Dance TUTORIAL @autikamaln'
    , media: url.format(path.join(process.cwd(), 'assets', 'video.mp4'))
  }
]

const parent = document.getElementById('main-selection')
const ul = h('ul.list-media-element')

mainSelection.forEach((menuItem) => {
  const li = h(
    'li.media-element'
    , h(
      'video.media'
      , {
        src: menuItem.media
        , width: 150
        , height: 100
        , muted: true
        , loop: true
        , playbackRate: 3
        , onmousedown () {
          this.play()
        }
        , onmouseup () {
          this.pause()
        }
      }, 'Sorry, no video.'
    )
    , h('h2.label', menuItem.label)
    , h('p.sublabel', menuItem.sublabel)
  )

  ul.appendChild(li)
})

parent.appendChild(ul)

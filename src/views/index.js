const { ipcRenderer } = require('electron')
const h = require('hyperscript')
const path = require('path')
const url = require('url')
const signals = require(path.join(process.cwd(), 'src', 'signals.js'))

// @TODO: load from config
const mainSelection = [
  {
    label: 'Insert Video'
    , sublabel: 'Description'
    , media: url.format(path.join(process.cwd(), 'assets', 'icons', 'mic.svg'))
    , resource: url.format('#')
  }
  , {
    label: 'Select Video'
    , sublabel: 'Description'
    , media: url.format(path.join(process.cwd(), 'assets', 'icons', 'mic.svg'))
    , resource: url.format(path.join(process.cwd(), 'src', 'views', 'videoSelection.html'))
  }
  , {
    label: 'Settings'
    , sublabel: 'Description'
    , media: url.format(path.join(process.cwd(), 'assets', 'icons', 'mic.svg'))
    , resource: url.format('#')
  }
]

const parent = document.getElementById('main-selection')
const ul = h('ul.list-pictures-large')

mainSelection.forEach((menuItem) => {
  const li = h(
    'li.list-item-pictures-large'
    , h(
      'a.box-center-content'
      , { href: menuItem.resource }
      , h('img', { src: menuItem.media, alt: `${menuItem.label} icon`, height: 50, width: 50 })
      , h('h2.label', menuItem.label)
    )
  )

  ul.appendChild(li)
})

parent.appendChild(ul)

ipcRenderer.on('signal', (event, message) => {
  console.log(signals.get(message))
})

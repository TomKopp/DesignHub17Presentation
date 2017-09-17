const h = require('hyperscript')
const path = require('path')
const url = require('url')

// @TODO: load from config
const mainSelection = [
  {
    label: 'Insert Video'
    , sublabel: 'Description'
    , media: url.format(path.join(process.cwd(), ' assets', 'icons', 'mic.svg'))
  }
  , {
    label: 'Select Video'
    , sublabel: 'Description'
    , media: url.format(path.join(process.cwd(), ' assets', 'icons', 'mic.svg'))
  }
  , {
    label: 'Settings'
    , sublabel: 'Description'
    , media: url.format(path.join(process.cwd(), ' assets', 'icons', 'mic.svg'))
  }
]

const parent = document.getElementById('main-selection')
const ul = h('ul.list-pictures-large')

mainSelection.forEach((menuItem) => {
  const li = h(
    'li.list-item-pictures-large'
    , h('img', { src: menuItem.media, alt: `${menuItem.label} icon`, height: 50, width: 50 })
    , h('h2', menuItem.label)
  )

  ul.appendChild(li)
})

parent.appendChild(ul)

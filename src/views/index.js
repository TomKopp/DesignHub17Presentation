const { ipcRenderer } = require('electron')
const h = require('hyperscript')
const { join } = require('path')
const { format } = require('url')
const signals = require(join(process.cwd(), 'config', 'signals.js'))
const stylingVars = require(join(process.cwd(), 'config', 'styling-variables.js'))

// @TODO: load from config
const mainSelection = [
	{
		label: 'Insert Video'
		, sublabel: 'Description'
		, media: format(join(process.cwd(), 'assets', 'icons', 'mic.svg'))
		, resource: format('#')
	}
	, {
		label: 'Select Video'
		, sublabel: 'Description'
		, media: format(join(process.cwd(), 'assets', 'icons', 'mic.svg'))
		, resource: format(join(process.cwd(), 'src', 'views', 'videoSelection.html'))
	}
	, {
		label: 'Settings'
		, sublabel: 'Description'
		, media: format(join(process.cwd(), 'assets', 'icons', 'mic.svg'))
		, resource: format('#')
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
			, h('img', { src: menuItem.media, alt: `${menuItem.label} icon`, height: stylingVars['size-icon-xxl'], width: stylingVars['size-icon-xxl'] })
			, h('h2.label', menuItem.label)
		)
	)

	ul.appendChild(li)
})

parent.appendChild(ul)

ipcRenderer.on('signal', (event, message) => {
	console.log(signals.get(message))
})

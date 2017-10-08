const { ipcRenderer } = require('electron')
const h = require('hyperscript')
const { join } = require('path')
const { format } = require('url')
const signals = require(join(process.cwd(), 'config', 'signals.js'))

// @TODO: load from config
const mainSelection = [
	{
		label: 'LAND OF ALL'
		, sublabel: 'contemporary dance - MN DANCE COMPANY'
		, media: format(join(process.cwd(), 'assets', 'video.mp4'))
		, resource: format(join(process.cwd(), 'src', 'views', 'animationCanvas.html'))
	}
	, {
		label: 'A Great Big World- Say Something'
		, sublabel: 'Contemporary Dance Auti Kamal x Matt Sagisi & Caitlin Barfield'
		, media: format(join(process.cwd(), 'assets', 'video.mp4'))
		, resource: format(join(process.cwd(), 'src', 'views', 'animationCanvas.html'))
	}
	, {
		label: 'A Great Big World- Say Something'
		, sublabel: 'Contemporary Dance TUTORIAL @autikamaln'
		, media: format(join(process.cwd(), 'assets', 'video.mp4'))
		, resource: format(join(process.cwd(), 'src', 'views', 'animationCanvas.html'))
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
				, onclick() {
					if (this.paused) {
						this.play()
					} else {
						this.pause()
					}
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

ipcRenderer.on('signal', (event, message) => {
	console.log(signals.get(message))
})

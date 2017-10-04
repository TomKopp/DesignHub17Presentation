module.exports = (() => {
	const signals = new Map()

	signals.set('playPause', 'playPause')
	signals.set('prev', 'prev')
	signals.set('next', 'next')

	return signals
})()

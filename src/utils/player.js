/* eslint no-magic-numbers: "off" */
/* eslint no-mixed-operators: "off" */
/* eslint func-style: "off" */
/* eslint max-params: "off" */
/* eslint max-statements: "off" */
const color = require('color')

/**
 * @param {string} id id
 * @param {Object} ctx cavas.getContext()
 * @param {string} fill color
 * @returns {Player} dancer
 */
function Player(id, ctx, fill) {
	this.id = id
	this.ctx = ctx
	this.color = fill
	this.lastUpdate = null
	this.wayPoints = []
	this.objects = []
}

Player.prototype.update = function update(tFrame) {
	const [
		x
		, y
		, timestamp
	] = this.wayPoints[this.traceCounter % this.wayPoints.length]

	if (tFrame - this.lastUpdate > timestamp) {
		this.objects[0] = new Dot(
			this.ctx
			, x
			, y
			, 20
			, color(this.color)
				.rgb()
				.string()
		)
		this.lastUpdate = tFrame
	}
}

Player.prototype.render = function render() {
	this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
	this.objects.forEach((el) => {
		el.draw()
	})
}


module.exports = Object.freeze({
	createPlayer: (id) => new Player(id)
})

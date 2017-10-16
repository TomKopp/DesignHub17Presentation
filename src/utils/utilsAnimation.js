/* eslint no-magic-numbers: "off" */
/* eslint no-mixed-operators: "off" */
/* eslint func-style: "off" */
/* eslint max-params: "off" */
/* eslint max-statements: "off" */
const color = require('color')

/**
 * @param {number} posX desc
 * @param {number} posY desc
 * @param {Object} ctx canvas.getContext()
 * @param {number} radius desc
 * @param {string} color desc
 * @returns {Dot} desc
 */
function Dot(posX, posY, ctx, radius, color) {
	this.x = posX
	this.y = posY
	this.radius = radius
	this.color = color
	this.ctx = ctx
}

Dot.prototype.render = function render() {
	this.ctx.beginPath();
	this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
	this.ctx.closePath();
	this.ctx.fillStyle = this.color;
	this.ctx.fill();
}


/**
 * @param {Object[]} wayPoints Path for the trace
 * @param {Object} ctx cavas.getContext()
 * @param {string} traceColor Base color for the trace
 * @returns {Trace} desc
 */
function Trace(wayPoints, ctx, traceColor) {
	this.isRunning = false
	// RequestAnimationFrame
	this.rAF = null
	this.lastTick = null
	// Time between Ticks in ms
	this.tickLength = 34
	// Canvas context
	this.ctx = ctx
	this.traceLength = 20
	this.traceCounter = 0
	this.trace = []
	this.traceColor = traceColor
	this.wayPoints = wayPoints

	this.fillTrace()
}

Trace.prototype.fillTrace = function fillTrace() {
	for (let i = 0; i < this.traceLength; i += 1) {
		const [
			x
			, y
		] = this.wayPoints[(this.traceCounter + i) % this.wayPoints.length]
		const alphaModifier = i / this.traceLength
		let radiusModifier = 0
		let dX = 0
		let dY = 0

		if (this.trace[i - 1]) {
			dX = x - this.trace[i - 1].x
			dY = y - this.trace[i - 1].y
		} else {
			dX = x - this.wayPoints[(this.traceCounter + i + 1) % this.wayPoints.length][0]
			dY = y - this.wayPoints[(this.traceCounter + i + 1) % this.wayPoints.length][1]
		}
		// radiusModifier = Math.log(Math.pow(Math.sqrt(dX * dX + dY * dY), -5)) + 5
		// radiusModifier = Math.pow(Math.E, -(Math.sqrt(dX * dX + dY * dY) - 7) / 2)
		// radiusModifier = Math.pow(Math.E, -(Math.sqrt(dX * dX + dY * dY) - 3.5))
		radiusModifier = Math.pow(1.9, -(Math.sqrt(dX * dX + dY * dY) - 5.5))
		const radius = 15 + radiusModifier
		const colorDot = color(this.traceColor)
			.alpha(0.1 + alphaModifier)
			.rgb()
			.string()

		this.trace[i] = new Dot(this.ctx, x, y, radius, colorDot)
	}
}

Trace.prototype.update = function update() {
	this.traceCounter += 1
	this.fillTrace()
}

Trace.prototype.render = function render() {
	this.trace.forEach((el) => {
		el.render()
	})
}


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
		el.render()
	})
}


/**
 *
 * @returns {Game} game
 */
function Game() {
	this.rAF = null
	this.paused = true
	this.objects = []
}

Game.prototype.main = function main(tFrame) {
	this.rAF = window.requestAnimationFrame(this.main)
	this.update(tFrame)
	this.render()
}

Game.prototype.update = function update(tFrame) {
	this.objects.forEach((player) => {
		player.update(tFrame)
	})
}

Game.prototype.render = function render() {
	this.objects.forEach((player) => {
		player.render()
	})
}

Game.prototype.play = function play() {
	this.paused = false
	this.main(performance.now())
}

Game.prototype.pause = function pause() {
	this.paused = true
	window.cancelAnimationFrame(this.rAF)
}


module.exports = Object.freeze({
	createDot: (ctx, posX = 0, posY = 0, radius = 10, color = '#667788') => new Dot(posX, posY, ctx, radius, color)
	, createTrace: (wayPoints, ctx, traceColor = '#fff') => new Trace(wayPoints, ctx, traceColor)
	, createPlayer: (id) => new Player(id)
	, createGame: () => new Game()
})

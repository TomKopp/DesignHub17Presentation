/* eslint no-magic-numbers: "off" */
/* eslint no-mixed-operators: "off" */
/* eslint func-style: "off" */
/* eslint max-params: "off" */
/* eslint max-statements: "off" */
// const { createPlayer } = require('player.js')

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
	createGame: () => new Game()
})

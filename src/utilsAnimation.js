/* eslint no-magic-numbers: "off" */
/* eslint func-style: "off" */
/* eslint max-params: "off" */
module.exports = (() => {

  /**
   * @param {number} posX desc
   * @param {number} posY desc
   * @param {number} radius desc
   * @param {string} color desc
   * @returns {Dot} desc
   */
  function Dot(posX, posY, radius, color) {
    this.x = posX
    this.y = posY
    this.radius = radius
    this.color = color
  }

  Dot.prototype.draw = function draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
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
    // Canvas context
    this.ctx = null
    this.traceLength = 10
    this.trace = []
    this.traceColor = traceColor
    this.wayPoints = wayPoints
  }

  /**
   * Creates a new Dot
   * @param {number} [posX=0] desc
   * @param {number} [posY=0] desc
   * @param {number} [radius=10] desc
   * @param {string} [color='#667788'] desc
   * @returns {Dot} desc
   */
  const createDot = (posX = 0, posY = 0, radius = 10, color = '#667788') => new Dot(posX, posY, radius, color)

  /**
   * Creates a new Trace
   * @param {Object[]} wayPoints Path for the trace
   * @param {Object} ctx canvas.getContext()
   * @param {string} [traceColor='#fff'] Base color for the trace
   * @returns {Trace} desc
   */
  const createTrace = (wayPoints, ctx, traceColor = '#fff') => new Trace(wayPoints, ctx, traceColor)


  return Object.freeze({
    createDot
    , createTrace
  })
})()

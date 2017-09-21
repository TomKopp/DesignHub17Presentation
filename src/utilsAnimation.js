/* eslint no-magic-numbers: "off" */
/* eslint func-style: "off" */
/* eslint max-params: "off" */
module.exports = (() => {

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
    this.ctx = null
  }

  Dot.prototype.draw = function draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    this.ctx.closePath();
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
  }

  /**
   * Creates a new Dot
   * @param {Object} ctx desc
   * @param {number} [posX=0] desc
   * @param {number} [posY=0] desc
   * @param {number} [radius=10] desc
   * @param {string} [color='#667788'] desc
   * @returns {Dot} desc
   */
  const createDot = (ctx, posX = 0, posY = 0, radius = 10, color = '#667788') => new Dot(posX, posY, ctx, radius, color)


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
    this.traceCounter = 0
    this.trace = []
    this.traceColor = traceColor
    this.wayPoints = wayPoints
  }

  Trace.prototype.fillTrace = function fillTrace() {
    for (let i = 0; i < this.traceLength; i += 1) {
      const [
        x
        , y
      ] = this.wayPoints[(this.traceCounter + i) % this.wayPoints.length]

      this.trace[i] = createDot(x, y, this.ctx)
    }
  }

  Trace.prototype.update = function update() {
    this.traceCounter += 1
    this.fillTrace()
  }

  Trace.prototype.render = function render() {
    this.trace.forEach((el) => {
      el.draw()
    })
  }

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

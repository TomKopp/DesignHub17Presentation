/* eslint no-magic-numbers: "off" */
/* eslint func-style: "off" */
/* eslint max-params: "off" */
module.exports = (() => {

  /**
   * @param {number} posX desc
   * @param {number} posY desc
   * @param {number} radius desc
   * @param {string} color desc
   * @returns {object} desc
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

  const createDot = (posX = 0, posY = 0, radius = 10, color = '#667788') => new Dot(posX, posY, radius, color)


  return Object.freeze({ createDot })
})()

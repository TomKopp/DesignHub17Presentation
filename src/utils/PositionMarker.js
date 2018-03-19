/* eslint func-style: "off" */
/* eslint no-magic-numbers: "off" */
/* eslint no-mixed-operators: "off" */
/* eslint no-multi-assign: "off" */
/* eslint max-statements: "off" */
/* eslint max-params: "off" */

/**
 * @param {Number} x middle point of polygons
 * @param {Number} y middle point of polygons
 * @param {Number[]} distances distances for each point from fixpoint
 * @param {Number[]} angles angles for each point from fixpoint in mathimaticle positive direction
 * @returns {PositionMarker} desc
 */
function PositionMarker(x, y, distances = [
	1
	, 1
	, 1
	, 1
	, 1
	, 1
	, 1
	, 1
	, 1
	, 1
], angles = [
	0
	, Math.PI * 0.2
	, Math.PI * 0.4
	, Math.PI * 0.6
	, Math.PI * 0.8
	, Math.PI
	, Math.PI * 1.2
	, Math.PI * 1.4
	, Math.PI * 1.6
	, Math.PI * 1.8
]) {
	this.x = x;
	this.y = y;
	this.shouldRender = true;
	this.color = 'rgba(255, 92, 57, 1)';
	this.radius = 50;

	angles.forEach((angle, key) => {
		this[`p${key}x`] = Math.cos(angle) * distances[key] + x;
		this[`p${key}y`] = Math.sin(angle) * distances[key] + y;
	});

	// this.p0x = Math.cos(angles[0]) * distances[0] + x;
	// this.p0z = Math.sin(angles[0]) * distances[0] + y;
	// this.p1x = Math.cos(angles[1]) * distances[1] + x;
	// this.p1y = Math.sin(angles[1]) * distances[1] + y;
	// this.p2x = Math.cos(angles[2]) * distances[2] + x;
	// this.p2y = Math.sin(angles[2]) * distances[2] + y;
	// this.p3x = Math.cos(angles[3]) * distances[3] + x;
	// this.p3y = Math.sin(angles[3]) * distances[3] + y;
	// this.p4x = Math.cos(angles[4]) * distances[4] + x;
	// this.p4y = Math.sin(angles[4]) * distances[4] + y;
	// this.p5x = Math.cos(angles[5]) * distances[5] + x;
	// this.p5y = Math.sin(angles[5]) * distances[5] + y;
	// this.p6x = Math.cos(angles[6]) * distances[6] + x;
	// this.p6y = Math.sin(angles[6]) * distances[6] + y;
	// this.p7x = Math.cos(angles[7]) * distances[7] + x;
	// this.p7y = Math.sin(angles[7]) * distances[7] + y;
	// this.p8x = Math.cos(angles[8]) * distances[8] + x;
	// this.p8y = Math.sin(angles[8]) * distances[8] + y;
	// this.p9x = Math.cos(angles[9]) * distances[9] + x;
	// this.p9y = Math.sin(angles[9]) * distances[9] + y;
}


/**
 * @param {Number} x middle point of polygons
 * @param {Number} y middle point of polygons
 * @param {Number[]} distances distances for each point from fixpoint
 * @param {Number[]} angles angles for each point from fixpoint in mathimaticle positive direction
 * @returns {PositionMarker} desc
 */
module.exports = PositionMarker;

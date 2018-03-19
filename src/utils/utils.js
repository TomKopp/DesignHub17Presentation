const { debuglog, inspect } = require('util');
const debugLogger = debuglog('debug');

/**
 * Log messages to stderr, if NODE_DEBUG=debug
 * @param	{any}	data any data will be parsed with util.inspect
 * @returns	{any}	identity function
 */
const debugLoggerStderr = (data) => {
	debugLogger(inspect(data));

	return data;
};

/**
 * Log messages to stderr
 * @param	{any}	data any data will be parsed with util.inspect
 * @returns	{any}	identity function
 */
const loggerStderr = (data) => {
	process.stderr.write(inspect(data));

	return data;
};

/**
 * Log messages to stdout
 * @param	{any}	data any data will be parsed with util.inspect
 * @returns	{any}	identity function
 */
const loggerStdout = (data) => {
	process.stdout.write(inspect(data));

	return data;
};

const compareTypes = (mask, elem) => typeof mask === typeof elem;

const isObject = (param) => compareTypes({}, param);

const deepFreeze = (obj) => {
	if (
		isObject(obj)
		&& !Object.isFrozen(obj)
	) {
		Object.keys(obj)
			.forEach((name) => deepFreeze(obj[name]));
		Object.freeze(obj);
	}

	return obj;
};

const filterByPropertyTypes = (mask, elem) => Object
	.keys(mask)
	.filter((prop) => compareTypes(mask[prop], elem[prop]))
	.reduce((carry, property) => {
		carry[property] = elem[property];

		return carry;
	}, {});

module.exports = Object.freeze({
	compareTypes
	, isObject
	, deepFreeze
	, filterByPropertyTypes
	, debugLoggerStderr
	, loggerStderr
	, loggerStdout
});

const compareTypes = (mask, elem) => typeof mask === typeof elem

const isObject = (param) => compareTypes({}, param)

const deepFreeze = (obj) => {
	if (
		isObject(obj)
		&& !Object.isFrozen(obj)
	) {
		Object.keys(obj)
			.forEach((name) => deepFreeze(obj[name]))
		Object.freeze(obj)
	}

	return obj
}

const filterByPropertyTypes = (mask, elem) => Object
	.keys(mask)
	.filter((prop) => compareTypes(mask[prop], elem[prop]))
	.reduce((carry, property) => {
		carry[property] = elem[property]

		return carry
	}, {})

module.exports = Object.freeze({
	compareTypes
	, isObject
	, deepFreeze
	, filterByPropertyTypes
})

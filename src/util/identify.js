
const exports = module.exports = {}

exports.isObject = (o) => { return typeof o === 'object' && !isArray(o) } 

exports.isArray = (o) => { return o.constructor === Array }

exports.isFunction = (o) => { return typeof o === 'function' }

exports.isBoolean = (o) => { return typeof o === 'boolean' }

exports.isNumber = (o) => { return typeof o === 'number' }

exports.isString = (o) => { return typeof o === 'string' }

exports.isSymbol = (o) => { return typeof o === 'symbol' }

exports.isNull = (o) => { return o === null }

exports.isDefined = (o) => { return typeof o !== 'undefined' }

exports.isUndefined = (o) => { return typeof o === 'undefined' }

exports.exists = (o) => { return isDefined(o) && !isNull(o) }

exports.isCharNumber = (ch) => { return isString(ch) && ch.length==1 && /([0-9])/.test(ch) }

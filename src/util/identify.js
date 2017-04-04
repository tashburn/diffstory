
function isObject(o) { return typeof o === 'object' && !isArray(o) }

function isArray(o) { return o.constructor === Array }

function isFunction(o) { return typeof o === 'function' }

function isBoolean(o) { return typeof o === 'boolean' }

function isNumber(o) { return typeof o === 'number' }

function isString(o) { return typeof o === 'string' }

function isSymbol(o) { return typeof o === 'symbol' }

function isNull(o) { return o === null }

function isDefined(o) { return typeof o !== 'undefined' }

function isUndefined(o) { return typeof o === 'undefined' }

function exists(o) { return isDefined(o) && !isNull(o) }

function isCharNumber(ch) { return isString(ch) && ch.length==1 && /([0-9])/.test(ch) }


module.exports = {
  isObject: isObject,
  isArray: isArray,
  isFunction: isFunction,
  isBoolean: isBoolean,
  isNumber: isNumber,
  isString: isString,
  isSymbol: isSymbol,
  isNull: isNull,
  isDefined: isDefined,
  isUndefined: isUndefined,
  exists: exists,
  isCharNumber: isCharNumber,
}
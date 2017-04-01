
module.exports = {

  isObject: (o) => { return typeof o === 'object' && !isArray(o) },

  isArray: (o) => { return o.constructor === Array },

  isFunction: (o) => { return typeof o === 'function' },

  isBoolean: (o) => { return typeof o === 'boolean' },

  isNumber: (o) => { return typeof o === 'number' },

  isString: (o) => { return typeof o === 'string' },

  isSymbol: (o) => { return typeof o === 'symbol' },

  isNull: (o) => { return o === null },

  isDefined: (o) => { return typeof o !== 'undefined' },

  isUndefined: (o) => { return typeof o === 'undefined' },

  exists: (o) => { return isDefined(o) && !isNull(o) },

  isCharNumber: (ch) => { return isString(ch) && ch.length==1 && /([0-9])/.test(ch) },

}
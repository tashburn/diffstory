
export function isObject(o) { return typeof o === 'object' && !isArray(o) } 

export function isArray(o) { return o.constructor === Array }

export function isFunction(o) { return typeof o === 'function' }

export function isBoolean(o) { return typeof o === 'boolean' }

export function isNumber(o) { return typeof o === 'number' }

export function isString(o) { return typeof o === 'string' }

export function isSymbol(o) { return typeof o === 'symbol' }

export function isNull(o) { return o === null }

export function isDefined(o) { return typeof o !== 'undefined' }

export function isUndefined(o) { return typeof o === 'undefined' }

export function exists(o) { return isDefined(o) && !isNull(o) }

export function isCharNumber(ch) { return isString(ch) && ch.length==1 && /([0-9])/.test(ch) }

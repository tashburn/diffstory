const {
  VALUE_INSTRUCTIONS,
  STRING_INSTRUCTIONS,
  OBJECT_INSTRUCTIONS,
  ARRAY_INSTRUCTIONS,
} = require('../instructions')


function isObject(o) { return typeof o === 'object' && !isArray(o) }

function isArray(value) { return Array.isArray(value) }

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

// diff identification
function isBooleanDiff(d) { return isObject(d) && hasInstrKey(d, VALUE_INSTRUCTIONS) }
function isNumberDiff(d) { return isObject(d) && hasInstrKey(d, VALUE_INSTRUCTIONS) }
function isStringDiff(d) { return isArray(d) && hasInstrKey(d, STRING_INSTRUCTIONS) }
function isObjectDiff(d) { return isObject(d) && hasInstrKey(d, OBJECT_INSTRUCTIONS) }
function isArrayDiff(d) { return isArray(d) && hasInstrKey(d, ARRAY_INSTRUCTIONS) }
function hasInstrKey(d, instructions) {
  if (isObject(d)) {
    return instructions.reduce( (acc,instr) => { return acc || (instr in d) }, false)
  }
  else if (isArray(d)) {
    if (d.length==0) 
      return true
    for (let item of d) {
      if (!isObject(item))
        return false
      if (instructions.reduce( (acc,instr) => { return acc || (instr in item) }, false))
        return true
    }
    return false
  }
  else
    throw new Error('not an obj or arr: '+JSON.stringify(d))
}

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
  isBooleanDiff,
  isNumberDiff,
  isStringDiff,
  isObjectDiff,
  isArrayDiff,
}
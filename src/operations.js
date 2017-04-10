const { isBoolean, isNumber, isString, isObject, isArray } = require('./util/identify')
const { NEW_VALUE, OLD_VALUE } = require('./instructions')
const { objectOperations } = require('./operationsObjects')
const { arrayOperations } = require('./operationsArrays')
const { stringOperations } = require('./operationsStrings')


function operations(thing1, thing2) {
  // objects
  if (isObject(thing1) && isObject(thing2)) {
    return objectOperations(thing1, thing2)
  }
  // arrays
  else if (isArray(thing1) && isArray(thing2)) {
    return arrayOperations(thing1, thing2)
  }
  // strings
  else if (isString(thing1) && isString(thing2)) {
    return stringOperations(thing1, thing2)
  }
  // the rest
  else {
    return {
      [OLD_VALUE]: thing1,
      [NEW_VALUE]: thing2,
    }
  }
}


module.exports.operations = operations
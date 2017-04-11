const { isBoolean, isNumber, isString, isObject, isArray } = require('./util/identify')
const { NEW_VALUE, OLD_VALUE } = require('./instructions')
const { isObjectOperation, objectOperations, objectOperationAfter, objectOperationBefore } = require('./operationsObjects')
const { isArrayOperation, arrayOperations, arrayOperationForward, arrayOperationBackward } = require('./operationsArrays')
const { isStringOperation, stringOperations, stringOperationForward, stringOperationBackward } = require('./operationsStrings')


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


function operationAfter(op) {
  // primitives
  if (isSubstitutionOperation(op)) {
    return op[NEW_VALUE]
  }
  // objects
  else if (isObjectOperation(op)) {
    return objectOperationAfter(op)
  }
  // arrays
  else if (isArrayOperation(op)) {
    return arrayOperationForward(op)
  }
  // strings
  else if (isStringOperation(op)) {
    console.log('is string op')
    return stringOperationForward(op)
  }
  // the rest
  else {
    throw 'bad op: '+JSON.stringify(op)
  }
}


function operationBefore(op) {
  // primitives
  if (isSubstitutionOperation(op)) {
    return op[OLD_VALUE]
  }
  // objects
  else if (isObjectOperation(op)) {
    return objectOperationBefore(op)
  }
  // arrays
  else if (isArrayOperation(op)) {
    return arrayOperationBackward(op)
  }
  // strings
  else if (isStringOperation(op)) {
    return stringOperationBackward(op)
  }
  // the rest
  else {
    throw 'bad op: '+JSON.stringify(op)
  }
}


function isSubstitutionOperation(op) {
  return isObject(op) && (NEW_VALUE in op && OLD_VALUE in op)
}


module.exports.operations = operations
module.exports.operationBefore = operationBefore
module.exports.operationAfter = operationAfter

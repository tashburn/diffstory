const concat = require('lodash/concat')
const keys = require('lodash/keys')
const cloneDeep = require('lodash/cloneDeep')
const isEqual = require('lodash/isEqual')

const { isBoolean, isNumber, isString, isObject, isArray } = require('./util/identify')
const { isBooleanDiff, isNumberDiff, isStringDiff, isObjectDiff, isArrayDiff } = require('./util/identify')
const instructions = require('./instructions')
const { diffObjects, forwardObject, backwardObject } = require('./diffObjects')
const { diffArrays, forwardArray, backwardArray } = require('./diffArrays')
const { diffStrings, diffStringsCompact, forwardString, backwardString, stringDiffToOperations } = require('./diffStrings')
const { operations, operationAfter, operationBefore } = require('./operations')

const { NEW_VALUE, OLD_VALUE } = instructions


function diff(thing1, thing2, options={}) {
  // console.log('diff options: '+JSON.stringify(options,null,2))
  // const sameId = (typeof o !== 'undefined')
  // console.log('diff options: '+sameId)
  // console.log('diff '+thing1+" vs "+thing2+", options "+options)

  // optimized case: objects (add,remove,update)
  if (isObject(thing1) && isObject(thing2)) {
    return diffObjects(thing1, thing2, options)
  }
  // optimized case: arrays (add,remove,update,cut,paste)
  else if (isArray(thing1) && isArray(thing2)) {
    return diffArrays(thing1, thing2, options)
  }
  // optimized case: strings
  else if (isString(thing1) && isString(thing2)) {
    return diffStrings(thing1, thing2, options)
  }
  // typical case (old/new)
  else {
    return {
      [OLD_VALUE]: thing1,
      [NEW_VALUE]: thing2,
    }
  }
}


function forward(diff) {
  if (isBooleanDiff(diff)) {
    return diff[NEW_VALUE]
  }
  else if (isNumberDiff(diff)) {
    return diff[NEW_VALUE]
  }
  else if (isStringDiff(diff)) {
    return forwardString(diff)
  }
  else if (isObjectDiff(diff)) {
    return forwardObject(diff)
  }
  else if (isArrayDiff(diff)) {
    return forwardArray(diff)
  }
  else throw new Error('Bad type: '+typeof(diff))
}


function backward(diff) {
  if (isBooleanDiff(diff)) {
    return diff[OLD_VALUE]
  }
  else if (isNumberDiff(diff)) {
    return diff[OLD_VALUE]
  }
  else if (isStringDiff(diff)) {
    return backwardString(diff)
  }
  else if (isObjectDiff(diff)) {
    return backwardObject(diff)
  }
  else if (isArrayDiff(diff)) {
    return backwardArray(diff)
  }
  else throw new Error('Bad type: '+typeof(diff))
}


function verify(oldThing, newThing, diff) {
  const oldThing2 = backward(newThing, diff)
  const newThing2 = forward(oldThing, diff)
  return isEqual(oldThing, oldThing2) && isEqual(newThing, newThing2)
}


// doing exports this way allows circular dependency

module.exports.instructions = instructions

module.exports.diff = diff
module.exports.forward = forward
module.exports.backward = backward

module.exports.diffStringsCompact = diffStringsCompact

// module.exports.stringDiffToOperations = stringDiffToOperations
module.exports.operations = operations
module.exports.operationAfter = operationAfter
module.exports.operationBefore = operationBefore

module.exports.verify = verify

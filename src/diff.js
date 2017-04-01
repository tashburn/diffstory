const concat = require('lodash/concat')
const keys = require('lodash/keys')
const cloneDeep = require('lodash/cloneDeep')

const { isBoolean, isNumber, isString, isObject, isArray } = require('./util/identify')
const { ADD, REMOVE, UPDATE, CUT, PASTE, NEW, OLD, SKIP } = require('./instructions')
const { diffObjects, forwardObject, backwardObject } = require('./diffObjects')
const { diffArrays, forwardArray, backwardArray } = require('./diffArrays')
const { diffStrings, forwardString, backwardString, stringDiffToOperations } = require('./diffStrings')


export function diff(thing1, thing2) {
  // optimized case: objects (add,remove,update)
  if (isObject(thing1) && isObject(thing2)) {
    return diffObjects(thing1, thing2)
  }
  // optimized case: arrays (add,remove,update,cut,paste)
  else if (isArray(thing1) && isArray(thing2)) {
    return diffArrays(thing1, thing2)
  }
  // optimized case: strings
  else if (isString(thing1) && isString(thing2)) {
    return diffStrings(thing1, thing2)
  }
  // typical case (old/new)
  else {
    return {
      [OLD]: thing1,
      [NEW]: thing2,
    }
  }
}


export function forward(thing, diff) {
  if (isBoolean(thing)) {
    return diff.new
  }
  else if (isNumber(thing)) {
    return diff.new
  }
  else if (isString(thing)) {
    return forwardString(thing, diff)
  }
  else if (isObject(thing)) {
    return forwardObject(thing, diff)
  }
  else if (isArray(thing)) {
    return forwardArray(thing, diff)
  }
  else throw 'Bad type: '+typeof(thing)
}


export function backward(thing, diff) {
  if (isBoolean(thing)) {
    return diff.old
  }
  else if (isNumber(thing)) {
    return diff.old
  }
  else if (isString(thing)) {
    return backwardString(thing, diff)
  }
  else if (isObject(thing)) {
    return backwardObject(thing, diff)
  }
  else if (isArray(thing)) {
    return backwardArray(thing, diff)
  }
  else throw 'Bad type: '+typeof(thing)
}


export default { 
  diff, 
  forward, 
  backward, 
  stringDiffToOperations 
}

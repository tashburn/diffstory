const difference = require('lodash/difference')
const intersection = require('lodash/intersection')
const keys = require('lodash/keys')
const merge = require('lodash/merge')
const cloneDeep = require('lodash/cloneDeep')
const isEmpty = require('lodash/isEmpty')
const isEqual = require('lodash/isEqual')

const { isString, isObject } = require('./util/identify')
const diffstory = require('./diff')
const { ADD_PROP, REMOVE_PROP, UPDATE_PROP, KEEP_PROP, NEW_VALUE, OLD_VALUE } = require('./instructions')
require('./util/functional')


function isObjectOperation(op) {
  return isObject(op) && 
    (ADD_PROP in op ||
    REMOVE_PROP in op ||
    UPDATE_PROP in op ||
    KEEP_PROP in op)
}


function objectOperations(object1, object2) {

  const ops = {}

  const keys1 = keys(object1)
  const keys2 = keys(object2)

  const keysAdded = difference(keys2, keys1)
  const keysRemoved = difference(keys1, keys2)
  const keysShared = intersection(keys1, keys2)

  const added = {}
  keysAdded.forEach(k => { added[k] = object2[k] })
  if (!isEmpty(added)) 
    ops[ADD_PROP] = added

  const removed = {}
  keysRemoved.forEach(k => { removed[k] = object1[k] })
  if (!isEmpty(removed)) 
    ops[REMOVE_PROP] = removed

  const updated = {}
  const kept = {}
  keysShared.forEach(k => {
    const v1 = object1[k]
    const v2 = object2[k]
    if (!isEqual(v1,v2))
      updated[k] = diffstory.operations(v1,v2)
    else
      kept[k] = v1
  })
  if (!isEmpty(updated)) 
    ops[UPDATE_PROP] = updated
  if (!isEmpty(kept)) 
    ops[KEEP_PROP] = kept

  return ops  
}


function objectOperationAfter(op) {
  let ret = {}
  for (let key of keys(op)) {
    console.log('key: '+key)
    const val = op[key]
    switch (key) {
      case ADD_PROP:
        ret = merge(ret, val)
        break
      case REMOVE_PROP:
        break
      case UPDATE_PROP:
        const kv = val.map((k,v) => [k, diffstory.operationAfter(v)])
        ret = merge(ret, kv)
        break
      case KEEP_PROP:
        ret = merge(ret, val)
        break
      default:
        throw 'bad instruction: '+key
    }
  }
  return ret
}


function objectOperationBefore(op) {
  let ret = {}
  for (let key of keys(op)) {
    console.log('key: '+key)
    const val = op[key]
    switch (key) {
      case ADD_PROP:
        break
      case REMOVE_PROP:
        ret = merge(ret, val)
        break
      case UPDATE_PROP:
        const kv = val.map((k,v) => [k, diffstory.operationBefore(v)])
        ret = merge(ret, kv)
        break
      case KEEP_PROP:
        ret = merge(ret, val)
        break
      default:
        throw 'bad instruction: '+key
    }
  }
  return ret
}


module.exports.isObjectOperation = isObjectOperation
module.exports.objectOperations = objectOperations
module.exports.objectOperationAfter = objectOperationAfter
module.exports.objectOperationBefore = objectOperationBefore

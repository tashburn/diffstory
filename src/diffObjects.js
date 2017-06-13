const difference = require('lodash/difference')
const intersection = require('lodash/intersection')
const keys = require('lodash/keys')
const cloneDeep = require('lodash/cloneDeep')
const isEmpty = require('lodash/isEmpty')
const isEqual = require('lodash/isEqual')

const diffstory = require('./diff')
const { isString } = require('./util/identify')
const { ADD_PROP, REMOVE_PROP, UPDATE_PROP, KEEP_PROP, NEW_VALUE, OLD_VALUE } = require('./instructions')


function diffObjects(object1, object2, options={}) {

  const diff = {}

  const keys1 = keys(object1)
  const keys2 = keys(object2)

  const keysAdded = difference(keys2, keys1)
  const keysRemoved = difference(keys1, keys2)
  const keysShared = intersection(keys1, keys2)

  const added = {}
  keysAdded.forEach(k => { added[k] = object2[k] })
  if (!isEmpty(added)) 
    diff[ADD_PROP] = added

  const removed = {}
  keysRemoved.forEach(k => { removed[k] = object1[k] })
  if (!isEmpty(removed)) 
    diff[REMOVE_PROP] = removed

  const updated = {}
  const kept = {}
  keysShared.forEach(k => {
    const v1 = object1[k]
    const v2 = object2[k]
    if (isEqual(v1,v2))
      kept[k] = v1
    else
      updated[k] = diffstory.diff(v1,v2)
  })
  if (!isEmpty(updated)) 
    diff[UPDATE_PROP] = updated
  if (!isEmpty(kept)) 
    diff[KEEP_PROP] = kept

  return diff  
}


function forwardObject(thing, diff) {
  const ret = cloneDeep(thing)
  
  const add = diff[ADD_PROP]
  for (let key in add || {}) {
    ret[key] = add[key]
  }

  const remove = diff[REMOVE_PROP]
  for (let key in remove || {}) {
    delete ret[key]
  }

  const update = diff[UPDATE_PROP]
  for (let key in update || {}) {
    const udiff = update[key]
    if (isString(udiff)) {
      ret[key] = diffstory.forward(ret[key], udiff)
    }
    else if (OLD_VALUE in udiff) {
      ret[key] = udiff[NEW_VALUE]
    }
    else {
      ret[key] = diffstory.forward(ret[key], udiff)
    }
  }

  return ret  
}


function backwardObject(thing, diff) {

  const ret = cloneDeep(thing)
  
  const add = diff[ADD_PROP]
  for (let key in add || {}) {
    delete ret[key]
  }

  const remove = diff[REMOVE_PROP]
  for (let key in remove || {}) {
    ret[key] = remove[key]
  }

  const update = diff[UPDATE_PROP]
  for (let key in update || {}) {
    const udiff = update[key]
    if (isString(udiff)) {
      ret[key] = diffstory.backward(ret[key], udiff)
    }
    else if (OLD_VALUE in udiff) {
      ret[key] = udiff[OLD_VALUE]
    }
    else {
      ret[key] = diffstory.backward(ret[key], udiff)
    }
  }

  return ret  
}


module.exports.diffObjects = diffObjects
module.exports.forwardObject = forwardObject
module.exports.backwardObject = backwardObject
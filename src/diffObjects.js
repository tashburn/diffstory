const difference = require('lodash/difference')
const intersection = require('lodash/intersection')
const keys = require('lodash/keys')
const cloneDeep = require('lodash/cloneDeep')
const isEmpty = require('lodash/isEmpty')
const isEqual = require('lodash/isEqual')

const computeDiff = require('./diff').diff
const { ADD, REMOVE, UPDATE, OLD, NEW } = require('./instructions')
const { isString } = require('./util/identify')


function diffObjects(object1, object2) {
  const diff = {}

  const keys1 = keys(object1)
  const keys2 = keys(object2)

  const keysAdded = difference(keys2, keys1)
  const keysRemoved = difference(keys1, keys2)
  const keysShared = intersection(keys1, keys2)

  const added = {}
  keysAdded.forEach(k => { added[k] = object2[k] })
  if (!isEmpty(added)) 
    diff[ADD] = added

  const removed = {}
  keysRemoved.forEach(k => { removed[k] = object1[k] })
  if (!isEmpty(removed)) 
    diff[REMOVE] = removed

  const updated = {}
  keysShared.forEach(k => {
    const v1 = object1[k]
    const v2 = object2[k]
    if (!isEqual(v1,v2))
      updated[k] = computeDiff(v1,v2)
  })
  if (!isEmpty(updated)) 
    diff[UPDATE] = updated

  return diff  
}


function forwardObject(thing, diff) {
  const ret = cloneDeep(thing)
  
  const add = diff[ADD]
  for (let key in add || {}) {
    ret[key] = add[key]
  }

  const remove = diff[REMOVE]
  for (let key in remove || {}) {
    delete ret[key]
  }

  const update = diff[UPDATE]
  for (let key in update || {}) {
    const udiff = update[key]
    if (isString(udiff)) {
      ret[key] = forward(ret[key], udiff)
    }
    else if (OLD in udiff) {
      ret[key] = udiff[NEW]
    }
    else {
      ret[key] = forward(ret[key], udiff)
    }
  }

  return ret  
}


function backwardObject(thing, diff) {

  const ret = cloneDeep(thing)
  
  const add = diff[ADD]
  for (let key in add || {}) {
    delete ret[key]
  }

  const remove = diff[REMOVE]
  for (let key in remove || {}) {
    ret[key] = remove[key]
  }

  const update = diff[UPDATE]
  for (let key in update || {}) {
    const udiff = update[key]
    if (isString(udiff)) {
      ret[key] = backward(ret[key], udiff)
    }
    else if (OLD in udiff) {
      ret[key] = udiff[OLD]
    }
    else {
      ret[key] = backward(ret[key], udiff)
    }
  }

  return ret  
}


module.exports = { diffObjects, forwardObject, backwardObject }
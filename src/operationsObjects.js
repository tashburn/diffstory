const difference = require('lodash/difference')
const intersection = require('lodash/intersection')
const keys = require('lodash/keys')
const cloneDeep = require('lodash/cloneDeep')
const isEmpty = require('lodash/isEmpty')
const isEqual = require('lodash/isEqual')

const diffstory = require('./diff')
const { isString } = require('./util/identify')
const { ADD_PROP, REMOVE_PROP, UPDATE_PROP, KEEP_PROP, NEW_VALUE, OLD_VALUE } = require('./instructions')


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


module.exports.objectOperations = objectOperations

import difference from 'lodash/difference'
import intersection from 'lodash/intersection'
import keys from 'lodash/keys'
import isEmpty from 'lodash/isEmpty'

import diff from './diff'
import { ADD, REMOVE, UPDATE } from './instructions'


export default function diffObjects(object1, object2) {
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
      updated[k] = diff(v1,v2)
  })
  if (!isEmpty(updated)) 
    diff[UPDATE] = updated

  return diff  
}
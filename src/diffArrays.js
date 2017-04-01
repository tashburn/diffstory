import isEqual from 'lodash/isEqual'
import intersection from 'lodash/intersection'
import keys from 'lodash/keys'

import { longestCommonSubsequence } from './util/lcs'
import diffObjects from './diffObjects'
import { isObject, isArray, isDefined } from './util/identify'

export default function diffArrays(arr1, arr2) {

  // find LCS
  const info = longestCommonSubsequence(arr1, arr2)

  let ret

  // no LCS?
  if (info.length==0) {
    ret = []
    if (arr1.length>0) ret.push({[REMOVE]:arr1})
    if (arr2.length>0) ret.push({[ADD]:arr2})
  }
  else {

    const lcs = arr1.slice(info.offset1, info.offset1+info.length)

    // LCS indexes
    const ix1 = info.offset1
    const ix2 = info.offset2

    // split  
    const left1 = arr1.slice(0, ix1)
    const left2 = arr2.slice(0, ix2)
    const right1 = arr1.slice(ix1+lcs.length)
    const right2 = arr2.slice(ix2+lcs.length)

    // recurse
    const lefts = diffArrays(left1, left2)
    const rights = diffArrays(right1, right2)

    // combine
    ret = concat(lefts, {[SKIP]:lcs.length}, rights)
  }

  // find cut/paste opportunities
  let nextCutId = 1

  // find updates: adjacent REMOVE/ADD that are objects with 1+ common keys
  // TODO: handle old [{key:1}] and new [1,{key:2}]
  for (let i1=0; i1<ret.length-1; i1++) {
    let i2 = i1 + 1
    const part1 = ret[i1]
    const part2 = ret[i2]
    // add then remove?
    if (REMOVE in part1 && ADD in part2) {
      const arr1 = part1[REMOVE]
      const arr2 = part2[ADD]
      // both arrays of size1?
      if (arr1.length==1 && arr2.length==1) {
        const val1 = arr1[0]
        const val2 = arr2[0]
        // both objects?
        if (isObject(val1) && isObject(val2)) {
          if (intersection(keys(val1),keys(val2)).length > 0) {
            ret[i1] = diffObjects(val1, val2)
            ret.splice(i2, 1) // remove at index i2
          }
        }
      }
    }
  }

  // find reordering: any ADD and REMOVE that are identical
  // make them CUT and PASTE
  // {cut1:3} means "cut #1 cuts 3 array elements"
  // {paste1:3} means "paste #1 pastes 3 array elements"
  ret.forEach((plusPart,plusIx)=>{
    const plusValue = plusPart[ADD]
    if (isDefined(plusValue)) {
      ret.forEach((minusPart,minusIx)=>{
        const minusValue = minusPart[REMOVE]
        if (isDefined(minusValue)) {
          if (isEqual(plusValue, minusValue)) {
            // only do this for bigger structures like objects and arrays
            if (isObject(plusValue) || isArray(plusValue)) {
              const cut = CUT+nextCutId
              const paste = PASTE+nextCutId
              ret[minusIx] = { [cut]: minusValue.length }
              ret[plusIx] = { [paste]: plusValue.length }
              nextCutId += 1
            }
          }
        }
      })
    }
  })

  return ret
}

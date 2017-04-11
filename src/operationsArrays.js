const isEqual = require('lodash/isEqual')
const intersection = require('lodash/intersection')
const keys = require('lodash/keys')
const concat = require('lodash/concat')

const { longestCommonSubsequence } = require('./util/lcs')
const diffstory = require('./diff')
const { diffObjects } = require('./diffObjects')
const { isObject, isArray, isDefined } = require('./util/identify')
const { ADD_PROP, REMOVE_PROP, UPDATE_PROP, ADD_ITEM, REMOVE_ITEM, UPDATE_ITEM, CUT_ITEM, PASTE_ITEM, SKIP_ITEM, KEEP_ITEM } = require('./instructions')


function isArrayOperation(op) {
  if (!isArray(op)) return false
  if (op.length==0) return true
  const i = op[0]
  return ADD_ITEM in i ||
    REMOVE_ITEM in i ||
    UPDATE_ITEM in i ||
    SKIP_ITEM in i ||
    KEEP_ITEM in i ||
    CUT_ITEM in i ||
    PASTE_ITEM in i
}


function arrayOperations(arr1, arr2) {

  // find LCS
  const info = longestCommonSubsequence(arr1, arr2)

  let ret

  // no LCS?
  if (info.length==0) {
    ret = []
    if (arr1.length>0) ret.push({[REMOVE_ITEM]:arr1})
    if (arr2.length>0) ret.push({[ADD_ITEM]:arr2})
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
    const lefts = arrayOperations(left1, left2)
    const rights = arrayOperations(right1, right2)

    // combine
    ret = concat(lefts, {[KEEP_ITEM]:lcs}, rights)
  }

  // // find cut/paste opportunities
  // let nextCutId = 1

  // find updates: adjacent REMOVE_ITEM/ADD_ITEM that are objects with 1+ common keys
  // TODO: handle old [{key:1}] and new [1,{key:2}]
  for (let i1=0; i1<ret.length-1; i1++) {
    let i2 = i1 + 1
    const part1 = ret[i1]
    const part2 = ret[i2]
    // add then remove?
    if (REMOVE_ITEM in part1 && ADD_ITEM in part2) {
      const arr1 = part1[REMOVE_ITEM]
      const arr2 = part2[ADD_ITEM]
      // both arrays of size1?
      if (arr1.length==1 && arr2.length==1) {
        const val1 = arr1[0]
        const val2 = arr2[0]
        // both objects?
        if (isObject(val1) && isObject(val2)) {
          if (intersection(keys(val1),keys(val2)).length > 0) {
            ret[i1] = { [UPDATE_ITEM]: diffstory.operations(val1, val2) }
            ret.splice(i2, 1) // remove at index i2
          }
        }
      }
    }
  }

  // // find reordering: any ADD_ITEM and REMOVE_ITEM that are identical
  // // make them CUT_ITEM and PASTE_ITEM
  // // {cut1:3} means "cut #1 cuts 3 array elements"
  // // {paste1:3} means "paste #1 pastes 3 array elements"
  // ret.forEach((plusPart,plusIx)=>{
  //   const plusValue = plusPart[ADD_ITEM]
  //   if (isDefined(plusValue)) {
  //     ret.forEach((minusPart,minusIx)=>{
  //       const minusValue = minusPart[REMOVE_ITEM]
  //       if (isDefined(minusValue)) {
  //         if (isEqual(plusValue, minusValue)) {
  //           // only do this for bigger structures like objects and arrays
  //           if (isObject(plusValue) || isArray(plusValue)) {
  //             const cut = CUT_ITEM+nextCutId
  //             const paste = PASTE_ITEM+nextCutId
  //             ret[minusIx] = { [cut]: minusValue.length }
  //             ret[plusIx] = { [paste]: plusValue.length }
  //             nextCutId += 1
  //           }
  //         }
  //       }
  //     })
  //   }
  // })

  return ret
}


function arrayOperationForward(op) {
  ret = []
  for (let item of op) {
    const instruction = keys(item)[0]
    const val = item[instruction]
    switch (instruction) {
      case ADD_ITEM: 
        ret = concat(ret, val)
        break
      case REMOVE_ITEM: 
        break
      case KEEP_ITEM: 
        ret = concat(ret, val)
        break
      case UPDATE_ITEM: 
        ret = concat(ret, diffstory.operationAfter(val))
        break
    }
  }
  return ret
}


function arrayOperationBackward(op) {
  ret = []
  for (let item of op) {
    const instruction = keys(item)[0]
    const val = item[instruction]
    switch (instruction) {
      case ADD_ITEM: 
        break
      case REMOVE_ITEM: 
        ret = concat(ret, val)
        break
      case KEEP_ITEM: 
        ret = concat(ret, val)
        break
      case UPDATE_ITEM: 
        ret = concat(ret, diffstory.operationBefore(val))
        break
    }
  }
  return ret
}


module.exports.isArrayOperation = isArrayOperation
module.exports.arrayOperations = arrayOperations
module.exports.arrayOperationForward = arrayOperationForward
module.exports.arrayOperationBackward = arrayOperationBackward
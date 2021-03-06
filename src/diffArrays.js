const isEqual = require('lodash/isEqual')
const intersection = require('lodash/intersection')
const keys = require('lodash/keys')
const concat = require('lodash/concat')

const { longestCommonSubsequence } = require('./util/lcs')
const diffstory = require('./diff')
const { diffObjects } = require('./diffObjects')
const { isObject, isArray, isDefined } = require('./util/identify')
const { ADD_PROP, REMOVE_PROP, UPDATE_PROP, ADD_ITEM, REMOVE_ITEM, UPDATE_ITEM, KEEP_ITEM, CUT_ITEM, PASTE_ITEM, SKIP_ITEM } = require('./instructions')


function diffArrays(arr1, arr2, options={}) {
  // console.log('diffArrays options: '+JSON.stringify(options,null,2))

  // find LCS
  const info = longestCommonSubsequence(arr1, arr2, options.sameId || isEqual)

  let ret

  // no LCS?
  if (info.length==0) {
    ret = []
    // if (arr1.length>0) ret.push({[REMOVE_ITEM]:arr1})
    // if (arr2.length>0) ret.push({[ADD_ITEM]:arr2})
    if (arr1.length>0) arr1.forEach(m => ret.push({[REMOVE_ITEM]:m}) )
    if (arr2.length>0) arr2.forEach(m => ret.push({[ADD_ITEM]:m}) )
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
    const lefts = diffArrays(left1, left2, options)
    const rights = diffArrays(right1, right2, options)
    let middles = lcs.map( m => ({ [KEEP_ITEM]: m }) )

    // if sameId was used, some of the lcs might be object updates
    // console.log('options: '+JSON.stringify(options,null,2))
    if (isDefined(options.sameId)) {
      // console.log('sameId !!!')
      let anyUpdates = false
      let tmp = []
      for (let i=0; i<info.length; i+=1) {
        const v1 = arr1[info.offset1 + i]
        const v2 = arr2[info.offset2 + i]
        // console.log('v1 ',v1)
        // console.log('v2 ',v2)
        if (isObject(v1) && isObject(v2) && !isEqual(v1,v2)) {
          // console.log('not equal')
          anyUpdates = true
          tmp.push({[UPDATE_ITEM]: diffObjects(v1, v2, options)})
        } else {
          // tmp.push({[KEEP_ITEM]: [v1]})
          tmp.push({[KEEP_ITEM]: v1})
        }
      }
      if (anyUpdates)
        middles = tmp

      // TODO: compress multiple KEEP_ITEMS into one KEEP_ITEMS ?
      //..

    }

    // combine
    // ret = concat(lefts, {[SKIP_ITEM]:lcs.length}, rights) // don't include the content
    ret = concat(lefts, middles, rights) // include the content
  }

  // find cut/paste opportunities
  let nextCutId = 1

  // find updates: adjacent REMOVE_ITEM/ADD_ITEM that are objects fitting `sameObject`
  // if (options.sameObject) {
  //   for (let i1=0; i1<ret.length-1; i1++) {
  //     let i2 = i1 + 1
  //     const part1 = ret[i1]
  //     const part2 = ret[i2]
  //     // add then remove?
  //     if (REMOVE_ITEM in part1 && ADD_ITEM in part2) {
  //       const arr1 = part1[REMOVE_ITEM]
  //       const arr2 = part2[ADD_ITEM]
  //       // both arrays of size1?
  //       if (arr1.length==1 && arr2.length==1) {
  //         const val1 = arr1[0]
  //         const val2 = arr2[0]
  //         // both objects?
  //         if (isObject(val1) && isObject(val2)) {
  //           if (intersection(keys(val1),keys(val2)).length > 0) {
  //             ret[i1] = { [UPDATE_ITEM]: diffObjects(val1, val2, options) }
  //             ret.splice(i2, 1) // remove at index i2
  //           }
  //         }
  //       }
  //     }
  //   }
  // }


  // find updates: adjacent REMOVE_ITEM/ADD_ITEM that are objects with 1+ common keys
  // TODO: handle old [{key:1}] and new [1,{key:2}]
  // for (let i1=0; i1<ret.length-1; i1++) {
  //   let i2 = i1 + 1
  //   const part1 = ret[i1]
  //   const part2 = ret[i2]
  //   // add then remove?
  //   if (REMOVE_ITEM in part1 && ADD_ITEM in part2) {
  //     const arr1 = part1[REMOVE_ITEM]
  //     const arr2 = part2[ADD_ITEM]
  //     // both arrays of size1?
  //     if (arr1.length==1 && arr2.length==1) {
  //       const val1 = arr1[0]
  //       const val2 = arr2[0]
  //       // both objects?
  //       if (isObject(val1) && isObject(val2)) {
  //         if (intersection(keys(val1),keys(val2)).length > 0) {
  //           ret[i1] = { [UPDATE_ITEM]: diffObjects(val1, val2, options) }
  //           ret.splice(i2, 1) // remove at index i2
  //         }
  //       }
  //     }
  //   }
  // }

  // find reordering: any ADD_ITEM and REMOVE_ITEM that are identical
  // make them CUT_ITEM and PASTE_ITEM
  // {cut1:3} means "cut #1 cuts 3 array elements"
  // {paste1:3} means "paste #1 pastes 3 array elements"
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

  // ret = flatten(ret)

  return ret
}


// instead of a diff like [ { keep:[1,2] } ], will be [ {keep:1}, {keep:2} ]
// which is easier to process
// function flatten(ops) {
//   const ret = []
//   for (let op of ops) {
//     console.log('op: '+JSON.stringify(op))
//     if (ADD_ITEM in op) {
//       for (let item of op[ADD_ITEM])
//         ret.push({[ADD_ITEM]:item})
//     } else if (REMOVE_ITEM in op) {
//       for (let item of op[REMOVE_ITEM])
//         ret.push({[REMOVE_ITEM]:item})
//     } else if (KEEP_ITEM in op) {
//       for (let item of op[KEEP_ITEM])
//         ret.push({[KEEP_ITEM]:item})
//     } else if (UPDATE_ITEM in op) {
//       for (let item of op[UPDATE_ITEM])
//         ret.push({[UPDATE_ITEM]:item})
//     } else throw new Error('bad op: '+JSON.stringify(op))
//   }
//   return ret
// }


function forwardArray(diff) {

  // // collect the cuts first
  // let ix = 0
  // const cuts = {}
  // diff.forEach(part => {
  //   if (SKIP_ITEM in part) {
  //     const members = thing.slice(ix, ix+part[SKIP_ITEM])
  //     ix += part[SKIP_ITEM]
  //   }
  //   else if (ADD_ITEM in part) {
  //   }
  //   else if (REMOVE_ITEM in part) {
  //     ix += part[REMOVE_ITEM].length
  //   }
  //   else if (UPDATE_ITEM in part) {
  //     ix += 1
  //   }
  //   else {
  //     // any cuts or pastes?
  //     const key = keys(part)[0]        
  //     if (key.startsWith(CUT_ITEM)) {
  //       const count = part[key]
  //       const members = thing.slice(ix, ix+count)
  //       cuts[key] = members
  //       ix += count
  //     }
  //     else if (key.startsWith(PASTE_ITEM)) {
  //     }
  //     else {
  //       throw 'Bad part: '+JSON.stringify(part)
  //     }

  //   }
  // })

  // now compose our new array
  let ret = []
  let ix = 0 // reset
  diff.forEach(part => {

    if (SKIP_ITEM in part) {
      const members = thing.slice(ix, ix+part[SKIP_ITEM])
      ret = concat(ret, members)
      ix += part[SKIP_ITEM]
    }
    else if (ADD_ITEM in part) {
      ret = concat(ret, part[ADD_ITEM])
    }
    else if (KEEP_ITEM in part) {
      ret = concat(ret, part[KEEP_ITEM])
    }
    else if (REMOVE_ITEM in part) {
      ix += part[REMOVE_ITEM].length
    }
    else if (UPDATE_ITEM in part) {
      const member = diffstory.forward(part[UPDATE_ITEM])
      ret.push(member)
      ix += 1
    }
    else {

      // any cuts or pastes?
      // const key = keys(part)[0]
      
      // if (key.startsWith(CUT_ITEM)) {
      // }
      // else if (key.startsWith(PASTE_ITEM)) {
      //   const cutsKey = CUT_ITEM+key.substring(PASTE_ITEM.length)
      //   const members = cuts[cutsKey]
      //   ret = concat(ret, members)
      // }
      // else {
      //   throw 'Bad part: '+JSON.stringify(part)
      // }

      throw 'Bad part: '+JSON.stringify(part)

    }
  })
  
  return ret
}


function backwardArray(diff) {

  // // collect the pastes first
  // let ix = 0
  // const pastes = {}
  // diff.forEach(part => {
  //   if (SKIP_ITEM in part) {
  //     const members = thing.slice(ix, ix+part[SKIP_ITEM])
  //     ix += part[SKIP_ITEM]
  //   }
  //   else if (ADD_ITEM in part) {
  //     ix += part[ADD_ITEM].length
  //   }
  //   else if (REMOVE_ITEM in part) {
  //   }
  //   else if (UPDATE_ITEM in part) {
  //     ix += 1
  //   }
  //   else {
  //     // any cuts or pastes?
  //     const key = keys(part)[0]        
  //     if (key.startsWith(CUT_ITEM)) {
  //     }
  //     else if (key.startsWith(PASTE_ITEM)) {
  //       const count = part[key]
  //       const members = thing.slice(ix, ix+count)
  //       pastes[key] = members
  //       ix += count
  //     }
  //     else {
  //       throw 'Bad part: '+JSON.stringify(part)
  //     }

  //   }
  // })

  // now compose our new array
  let ret = []
  let ix = 0 // reset
  diff.forEach(part => {

    if (SKIP_ITEM in part) {
      const members = thing.slice(ix, ix+part[SKIP_ITEM])
      ret = concat(ret, members)
      ix += part[SKIP_ITEM]
    }
    else if (KEEP_ITEM in part) {
      ret = concat(ret, part[KEEP_ITEM])
    }
    else if (ADD_ITEM in part) {
      ix += part[ADD_ITEM].length
    }
    else if (REMOVE_ITEM in part) {
      ret = concat(ret, part[REMOVE_ITEM])
    }
    else if (UPDATE_ITEM in part) {
      const member = diffstory.backward(part[UPDATE_ITEM])
      ret.push(member)
      ix += 1
    }
    else {

      // // any cuts or pastes?
      // const key = keys(part)[0]
      
      // if (key.startsWith(CUT_ITEM)) {
      //   const pastesKey = PASTE_ITEM+key.substring(CUT_ITEM.length)
      //   const members = pastes[pastesKey]
      //   ret = concat(ret, members)
      // }
      // else if (key.startsWith(PASTE_ITEM)) {
      //   ix += 1
      // }
      // else {
      //   throw 'Bad part: '+JSON.stringify(part)
      // }

      throw 'Bad part: '+JSON.stringify(part)

    }
  })
  
  return ret
}


module.exports.diffArrays = diffArrays
module.exports.forwardArray = forwardArray
module.exports.backwardArray = backwardArray
const concat = require('lodash/concat')
const keys = require('lodash/keys')

const { longestCommonSubstring } = require('./util/lcs')
const { isCharNumber, isArray } = require('./util/identify')
const StringStream = require('./util/StringStream')
const { ADD_STRING, REMOVE_STRING, KEEP_STRING } = require('./instructions')


function isStringOperation(op) {
  if (!isArray(op)) return false
  if (op.length==0) return true
  const i = op[0]
  return (ADD_STRING in i ||
    REMOVE_STRING in i ||
    KEEP_STRING in i)
}


function stringOperations(s1, s2) {

  // find LCS
  const info = longestCommonSubstring(s1, s2)

  // no LCS?
  if (info.length==0) {
    let ret = []
    s1 = s1.replace(/"/g, '\\"')
    s2 = s2.replace(/"/g, '\\"')
    if (s1.length>0) ret.push({[REMOVE_STRING]:s1})
    if (s2.length>0) ret.push({[ADD_STRING]:s2})
    return ret
  }

  const lcs = s1.substring(info.offset1, info.offset1+info.length)

  // LCS indexes
  const ix1 = info.offset1
  const ix2 = info.offset2

  // split  
  const left1 = s1.substring(0, ix1)
  const left2 = s2.substring(0, ix2)
  const right1 = s1.substring(ix1+lcs.length)
  const right2 = s2.substring(ix2+lcs.length)

  // recurse
  const lefts = stringOperations(left1, left2)
  const rights = stringOperations(right1, right2)

  // combine
  // const ret = lefts+'^'+lcs.length+rights // just the count
  const ret = concat(lefts, {[KEEP_STRING]:lcs}, rights)

  return ret
}


function stringOperationForward(op) {
  let parts = []
  for (let item of op) {
    let instruction = keys(item)[0]
    let val = item[instruction]
    switch (instruction) {
      case ADD_STRING:
        parts.push(val)
        break
      case REMOVE_STRING:
        break
      case KEEP_STRING:
        parts.push(val)
        break
      default:
        throw 'bad instruction: '+instruction
    }
  }
  return parts.join('')
}


function stringOperationBackward(op) {
  let parts = []
  for (let item of op) {
    let instruction = keys(item)[0]
    let val = item[instruction]
    switch (instruction) {
      case ADD_STRING:
        break
      case REMOVE_STRING:
        parts.push(val)
        break
      case KEEP_STRING:
        parts.push(val)
        break
      default:
        throw 'bad instruction: '+instruction
    }
  }
  return parts.join('')
}


module.exports.isStringOperation = isStringOperation
module.exports.stringOperations = stringOperations
module.exports.stringOperationForward = stringOperationForward
module.exports.stringOperationBackward = stringOperationBackward
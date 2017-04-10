const concat = require('lodash/concat')

const { longestCommonSubstring } = require('./util/lcs')
const { isCharNumber } = require('./util/identify')
const StringStream = require('./util/StringStream')


function stringOperations(s1, s2) {

  // find LCS
  const info = longestCommonSubstring(s1, s2)

  // no LCS?
  if (info.length==0) {
    let ret = []
    s1 = s1.replace(/"/g, '\\"')
    s2 = s2.replace(/"/g, '\\"')
    if (s1.length>0) ret.push({'-':s1})
    if (s2.length>0) ret.push({'+':s2})
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
  const ret = concat(lefts, {'&':lcs}, rights)

  return ret
}


module.exports.stringOperations = stringOperations
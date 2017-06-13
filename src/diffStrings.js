const { longestCommonSubstring } = require('./util/lcs')
const { isCharNumber } = require('./util/identify')
const StringStream = require('./util/StringStream')
const { ADD_STRING, REMOVE_STRING, KEEP_STRING, ADD_STRING_COMPACT, REMOVE_STRING_COMPACT, KEEP_STRING_COMPACT } = require('./instructions')


function diffStrings(s1, s2) {
  const compact = diffStringsCompact(s1,s2)
  // console.log('compact: '+compact)
  return stringDiffToOperations(compact)
}


function diffStringsCompact(s1, s2) {

  // find LCS
  const info = longestCommonSubstring(s1, s2)

  // no LCS?
  if (info.length==0) {
    let ret = ''
    s1 = s1.replace(/"/g, '\\"')
    s2 = s2.replace(/"/g, '\\"')
    if (s1.length>0) ret += REMOVE_STRING_COMPACT + '"' + s1 + '"'
    if (s2.length>0) ret += ADD_STRING_COMPACT + '"' + s2 + '"'
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
  const lefts = diffStringsCompact(left1, left2)
  const rights = diffStringsCompact(right1, right2)

  // combine
  // const ret = lefts+'^'+lcs.length+rights // just the count
  const ret = lefts + KEEP_STRING_COMPACT + '"' + lcs + '"' + rights

  return ret
}


function stringDiffToOperations(diff) {
  const parts = []
  let ix = 0
  const stream = new StringStream(diff)
  while (!stream.atEnd()) {
    const instr = stream.readChar()
    if (instr == KEEP_STRING_COMPACT) { // skip
      // const skipCount = Number(stream.readWhile(ch => isCharNumber(ch)))
      // const skipped = diff.substring(ix,ix+skipCount)
      // parts.push({'^':skipCount})
      stream.readChar('"')
      const kept = stream.readUntil((ch,info) => ch=='"' && info.prev()!='\\')
      stream.readChar('"')
      parts.push({[KEEP_STRING]:kept})
      ix += kept.length
    }
    else if (instr == ADD_STRING_COMPACT) { // add
      stream.readChar('"')
      const added = stream.readUntil((ch,info) => ch=='"' && info.prev()!='\\')
      stream.readChar('"')
      // parts.push(added)
      parts.push({[ADD_STRING]:added})
    }
    else if (instr == REMOVE_STRING_COMPACT) { // remove
      stream.readChar('"')
      const removed = stream.readUntil((ch,info) => ch=='"' && info.prev()!='\\')
      stream.readChar('"')
      ix += removed.length
      parts.push({[REMOVE_STRING]:removed})
    }
    else {
      throw 'bad instruction '+instr
    }
  }
  return parts
}


function forwardString(text, diff) {
  const parts = []
  let ix = 0
  stringDiffToOperations(diff).forEach(part => {
    if (KEEP_STRING in part) {
      // const skipCount = part['^']
      // const skipped = text.substring(ix,ix+skipCount)
      const skipped = part[KEEP_STRING]
      parts.push(skipped)
      ix += skipped.length
    }
    else if (ADD_STRING in part) {
      parts.push(part[ADD_STRING])
    }
    else if (REMOVE_STRING in part) {
      ix += part[REMOVE_STRING].length
    }
    else throw 'bad instruction '+JSON.stringify(part)
  })
  parts.push(text.substring(ix))
  return parts.join('')
}


function backwardString(text, diff) {
  const parts = []
  let ix = 0
  stringDiffToOperations(diff).forEach(part => {
    if (KEEP_STRING in part) {
      // const skipCount = part['^']
      // const skipped = text.substring(ix,ix+skipCount)
      const skipped = part[KEEP_STRING]
      parts.push(skipped)
      ix += skipped.length
    }
    else if (ADD_STRING in part) {
      ix += part[ADD_STRING].length
    }
    else if (REMOVE_STRING in part) {
      parts.push(part[REMOVE_STRING])
    }
    else throw 'bad instruction '+JSON.stringify(part)
  })
  parts.push(text.substring(ix))
  return parts.join('')
}


module.exports = {
  diffStrings,
  diffStringsCompact,
  stringDiffToOperations, 
  forwardString, 
  backwardString,
}


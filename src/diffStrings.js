// const jsdiff = require('diff')

const { longestCommonSubstring, longestCommonSubsequence } = require('./util/lcs')
const { isCharNumber } = require('./util/identify')
const StringStream = require('./util/StringStream')
const { tokenizeWords } = require('./util/tokenize')
const { ADD_STRING, REMOVE_STRING, KEEP_STRING, ADD_STRING_COMPACT, REMOVE_STRING_COMPACT, KEEP_STRING_COMPACT } = require('./instructions')


function diffStrings(s1, s2, options={}) {
  // const words = options.words===true || false

  // if (!words) {
    const compact = diffStringsCompact(s1,s2,options)
    // console.log('compact: '+compact)
    return stringDiffToOperations(compact)
  // } else {
  //   const result = jsdiff.diffWords(s1,s2)
  //   console.log(JSON.stringify(result,null,2))
  //   const ops = []
  //   for (let part of result) {  
  //     if (part.added) {
  //       ops.push({[ADD_STRING]:part.value})
  //     } else if (part.removed) {
  //       ops.push({[REMOVE_STRING]:part.value})
  //     } else {
  //       ops.push({[KEEP_STRING]:part.value})
  //     }
  //   }
  //   return ops
  // }
}


function diffStringsCompact(s1, s2, options={}) {

  const words = options.words===true || false
  
  // find LCS
  let info
  if (!words) {
    info = longestCommonSubstring(s1, s2)
  }
  else {
    const w1 = tokenizeWords(s1)
    const w2 = tokenizeWords(s2)
    seq = longestCommonSubsequence(w1, w2)

    if (seq.length==0) {
      info = { offset1: null, offset2: null, length: 0 }
    } else {

      // console.log('seq\n'+JSON.stringify(seq,null,2))

      // convert seq info back to string info
      info = { offset1: 0, offset2: 0, length: 0 }
      for (let i=0; i<seq.offset1; i+=1) {
        info.offset1 += w1[i].length
      }
      info.offset1 += seq.offset1 // spaces
      for (let i=0; i<seq.offset2; i+=1) {
        info.offset2 += w2[i].length
      }
      info.offset2 += seq.offset2 // spaces
      for (let i=seq.offset1; i<seq.offset1+seq.length; i+=1) {
        info.length += w1[i].length
      }
      info.length += seq.length-1 // spaces

      // console.log('info\n'+JSON.stringify(info,null,2))
    }
  }

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
  const lefts = diffStringsCompact(left1, left2, options)
  const rights = diffStringsCompact(right1, right2, options)

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


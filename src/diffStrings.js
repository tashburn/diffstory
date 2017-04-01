import { longestCommonSubstring } from './util/lcs'
import { isCharNumber } from './util/identify'
import StringStream from './util/StringStream'


export function diffStrings(s1, s2) {

  // find LCS
  const info = longestCommonSubstring(s1, s2)

  // no LCS?
  if (info.length==0) {
    let ret = ''
    s1 = s1.replace(/"/g, '\\"')
    s2 = s2.replace(/"/g, '\\"')
    if (s1.length>0) ret+='-"'+s1+'"'
    if (s2.length>0) ret+='+"'+s2+'"'
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
  const lefts = diffStrings(left1, left2)
  const rights = diffStrings(right1, right2)

  // combine
  const ret = lefts+'^'+lcs.length+rights

  return ret
}


export function stringDiffToOperations(diff) {
  const parts = []
  let ix = 0
  const stream = new StringStream(diff)
  while (!stream.atEnd()) {
    const instr = stream.readChar()
    if (instr == '^') { // skip
      const skipCount = Number(stream.readWhile(ch => isCharNumber(ch)))
      // const skipped = text.substring(ix,ix+skipCount)
      // parts.push(skipped)
      parts.push({'^':skipCount})
      ix += skipCount
    }
    else if (instr == '+') { // add
      stream.readChar('"')
      const added = stream.readUntil((ch,info) => ch=='"' && info.prev()!='\\')
      stream.readChar('"')
      // parts.push(added)
      parts.push({'+':added})
    }
    else if (instr == '-') { // remove
      stream.readChar('"')
      const removed = stream.readUntil((ch,info) => ch=='"' && info.prev()!='\\')
      stream.readChar('"')
      ix += removed.length
      parts.push({'-':removed})
    }
    else {
      throw 'bad instruction '+instr
    }
  }
  return parts
}


export function forwardString(text, diff) {
  const parts = []
  let ix = 0
  stringDiffToOperations(diff).forEach(part => {
    if ('^' in part) {
      const skipCount = part['^']
      const skipped = text.substring(ix,ix+skipCount)
      parts.push(skipped)
      ix += skipCount
    }
    else if ('+' in part) {
      parts.push(part['+'])
    }
    else if ('-' in part) {
      ix += part['-'].length
    }
    else throw 'bad instruction '+JSON.stringify(part)
  })
  parts.push(text.substring(ix))
  return parts.join('')
}


export function backwardString(text, diff) {
  const parts = []
  let ix = 0
  stringDiffToOperations(diff).forEach(part => {
    if ('^' in part) {
      const skipCount = part['^']
      const skipped = text.substring(ix,ix+skipCount)
      parts.push(skipped)
      ix += skipCount
    }
    else if ('+' in part) {
      ix += part['+'].length
    }
    else if ('-' in part) {
      parts.push(part['-'])
    }
    else throw 'bad instruction '+JSON.stringify(part)
  })
  parts.push(text.substring(ix))
  return parts.join('')
}


export default {
  diffStrings, 
  stringDiffToOperations, 
  forwardString, 
  backwardString,
}


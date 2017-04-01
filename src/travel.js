import concat from 'lodash/concat'
import keys from 'lodash/keys'
import cloneDeep from 'lodash/cloneDeep'

import { isString, isObject, isArray } from './util/identify'
import { StringStream } from './util/StringStream'


export function forward(thing, diff) {

  if (isString(thing)) {
    return forwardString(thing, diff)
  }
  else if (isObject(thing)) {
    const ret = cloneDeep(thing)
    
    const add = diff[ADD]
    for (let key in add || {}) {
      ret[key] = add[key]
    }

    const remove = diff[REMOVE]
    for (let key in remove || {}) {
      delete ret[key]
    }

    const update = diff[UPDATE]
    for (let key in update || {}) {
      const udiff = update[key]
      if (isString(udiff)) {
        ret[key] = forward(ret[key], udiff)
      }
      else if (OLD in udiff) {
        ret[key] = udiff[NEW]
      }
      else {
        ret[key] = forward(ret[key], udiff)
      }
    }

    return ret
  }
  else if (isArray(thing)) {

    // collect the cuts first
    let ix = 0
    const cuts = {}
    diff.forEach(part => {
      if (SKIP in part) {
        const members = thing.slice(ix, ix+part[SKIP])
        ix += part[SKIP]
      }
      else if (ADD in part) {
      }
      else if (REMOVE in part) {
        ix += part[REMOVE].length
      }
      else if (UPDATE in part) {
        ix += 1
      }
      else {
        // any cuts or pastes?
        const key = keys(part)[0]        
        if (key.startsWith(CUT)) {
          const count = part[key]
          const members = thing.slice(ix, ix+count)
          cuts[key] = members
          ix += count
        }
        else if (key.startsWith(PASTE)) {
        }
        else {
          throw 'Bad part: '+JSON.stringify(part)
        }

      }
    })

    // now compose our new array
    let ret = []
    ix = 0 // reset
    diff.forEach(part => {

      if (SKIP in part) {
        const members = thing.slice(ix, ix+part[SKIP])
        ret = concat(ret, members)
        ix += part[SKIP]
      }
      else if (ADD in part) {
        ret = concat(ret, part[ADD])
      }
      else if (REMOVE in part) {
        ix += part[REMOVE].length
      }
      else if (UPDATE in part) {
        const member = forward(thing[ix], part)
        ret.push(member)
        ix += 1
      }
      else {

        // any cuts or pastes?
        const key = keys(part)[0]
        
        if (key.startsWith(CUT)) {
        }
        else if (key.startsWith(PASTE)) {
          const cutsKey = CUT+key.substring(PASTE.length)
          const members = cuts[cutsKey]
          ret = concat(ret, members)
        }
        else {
          throw 'Bad part: '+JSON.stringify(part)
        }

      }
    })
    
    return ret
  }
  else throw 'Must be object or array'
}


export function backward(thing, diff) {
  if (isString(thing)) {
    return backwardString(thing, diff)
  }
  else if (isObject(thing)) {
    const ret = cloneDeep(thing)
    
    const add = diff[ADD]
    for (let key in add || {}) {
      delete ret[key]
    }

    const remove = diff[REMOVE]
    for (let key in remove || {}) {
      ret[key] = add[key]
    }

    const update = diff[UPDATE]
    for (let key in update || {}) {
      const udiff = update[key]
      if (isString(udiff)) {
        ret[key] = backward(ret[key], udiff)
      }
      else if (OLD in udiff) {
        ret[key] = udiff[OLD]
      }
      else {
        ret[key] = backward(ret[key], udiff)
      }
    }

    return ret
  }
  else if (isArray(thing)) {
    // collect the pastes first
    let ix = 0
    const pastes = {}
    diff.forEach(part => {
      if (SKIP in part) {
        const members = thing.slice(ix, ix+part[SKIP])
        ix += part[SKIP]
      }
      else if (ADD in part) {
        ix += part[ADD].length
      }
      else if (REMOVE in part) {
      }
      else if (UPDATE in part) {
        ix += 1
      }
      else {
        // any cuts or pastes?
        const key = keys(part)[0]        
        if (key.startsWith(CUT)) {
        }
        else if (key.startsWith(PASTE)) {
          const count = part[key]
          const members = thing.slice(ix, ix+count)
          pastes[key] = members
          ix += count
        }
        else {
          throw 'Bad part: '+JSON.stringify(part)
        }

      }
    })

    // now compose our new array
    let ret = []
    ix = 0 // reset
    diff.forEach(part => {

      if (SKIP in part) {
        const members = thing.slice(ix, ix+part[SKIP])
        ret = concat(ret, members)
        ix += part[SKIP]
      }
      else if (ADD in part) {
        ix += part[ADD].length
      }
      else if (REMOVE in part) {
        ret = concat(ret, part[REMOVE])
      }
      else if (UPDATE in part) {
        const member = backward(thing[ix], part)
        ret.push(member)
        ix += 1
      }
      else {

        // any cuts or pastes?
        const key = keys(part)[0]
        
        if (key.startsWith(CUT)) {
          const pastesKey = PASTE+key.substring(CUT.length)
          const members = pastes[pastesKey]
          ret = concat(ret, members)
        }
        else if (key.startsWith(PASTE)) {
          ix += 1
        }
        else {
          throw 'Bad part: '+JSON.stringify(part)
        }

      }
    })
    
    return ret
  }
  else throw 'Must be object or array'
}


export function forwardString(text, diff) {
  const parts = []
  let ix = 0
  const stream = new StringStream(diff)
  while (!stream.atEnd()) {
    const instr = stream.readChar()
    if (instr == '^') { // skip
      const skipCount = Number(stream.readWhile(ch => misc.isCharNumber(ch)))
      const skipped = text.substring(ix,ix+skipCount)
      parts.push(skipped)
      ix += skipCount
    }
    else if (instr == '+') { // add
      stream.readChar('"')
      const added = stream.readUntil((ch,info) => ch=='"' && info.prev()!='\\')
      stream.readChar('"')
      parts.push(added)
    }
    else if (instr == '-') { // remove
      stream.readChar('"')
      const removed = stream.readUntil((ch,info) => ch=='"' && info.prev()!='\\')
      stream.readChar('"')
      ix += removed.length
    }
    else {
      throw 'bad instruction '+instr
    }
  }
  parts.push(text.substring(ix))
  return parts.join('')
}


export function backwardString(text, diff) {
  const parts = []
  let ix = 0
  const stream = new StringStream(diff)
  while (!stream.atEnd()) {
    const instr = stream.readChar()
    if (instr == '^') { // skip
      const skipCount = Number(stream.readWhile(ch => misc.isCharNumber(ch)))
      const skipped = text.substring(ix,ix+skipCount)
      parts.push(skipped)
      ix += skipCount
    }
    else if (instr == '+') { // add
      stream.readChar('"')
      const removed = stream.readUntil((ch,info) => ch=='"' && info.prev()!='\\')
      stream.readChar('"')
      ix += removed.length
    }
    else if (instr == '-') { // remove
      stream.readChar('"')
      const added = stream.readUntil((ch,info) => ch=='"' && info.prev()!='\\')
      stream.readChar('"')
      parts.push(added)
    }
  }
  parts.push(text.substring(ix))
  return parts.join('')
}


export default { forward, backward, forwardString, backwardString }


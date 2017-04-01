
export default class StringStream {
  
  constructor(string) {
    this.string = string
    this.ix = 0
  }

  readChar(expectedChar=null) {
    if (this.atEnd())
      return undefined
    const ch = this.string.charAt(this.ix)
    if (expectedChar!=null && expectedChar!=ch)
      throw 'Expected char '+expectedChar
    this.ix += 1
    return ch
  }

  // reads while fn(ch) returns true, and includes ch
  readWhile(fn) {
    const chars = []
    const info = new Info(this)
    while (true) {
      if (this.atEnd())
        return chars.join('')
      const ch = this.string.charAt(this.ix)
      if (fn(ch,info)) {
        chars.push(ch)
        this.ix += 1
      } else {
        return chars.join('')
      }
    }
  }

  // reads until fn(ch) returns true, and includes ch
  readUntil(fn) {
    const chars = []
    const info = new Info(this)
    while (true) {
      if (this.atEnd())
        return chars.join('')
      const ch = this.string.charAt(this.ix)
      if (fn(ch,info)) {
        return chars.join('')
      } else {
        chars.push(ch)
        this.ix += 1
      }
    }
  }

  skip(count) {
    this.ix += count
  }
  
  peek(count=1) {
    return this.string.substring(this.ix, this.ix + count)
  }
  
  atEnd() {
    return this.ix >= this.string.length
  }

}


class Info {
  constructor(stringStream) {
    this.stream = stringStream
    this.startIx = stringStream.ix
  }
  string() {
    return this.stream.string
  }
  startIndex() {
    return this.startIx
  }
  index() {
    return this.stream.ix
  }
  prev() { // previous char
    return this.index()-1 < this.startIndex() 
      ? undefined 
      : this.string().charAt(this.index()-1)
  }
  next() { // next char
    return this.index()+1 >= this.string().length 
      ? undefined 
      : string().charAt(this.index()+1)
  }
  acc() { // accumulated string to return
    return this.index() === this.startIndex() 
      ? '' 
      : string.substring(this.startIndex(), this.index()-1)
  }
}
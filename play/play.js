// This is code to play around with

const diffstory = require('../src/diff')
// const jsdiff = require('diff')

function debug(...args) {
  console.log(...args)
}


// objects
// const a = [{id:1,a:1,b:2}]
// const b = [{id:1,b:22,c:33}]
// const diff = diffstory.diff(a,b,{sameId: (a,b)=>a.id===b.id})
// debug('diff',diff)
// const update = diff[0]['!item']
// debug('update',update)
// const back = diffstory.backward(update)
// const fore = diffstory.forward(update)
// debug('back',back)
// debug('fore',fore)

// arrays of primitives
// const a = [1,2]
// const b = [2,3]
// const diff = diffstory.diff(a,b)
// debug('diff',diff)
// const back = diffstory.backward(diff)
// const fore = diffstory.forward(diff)
// debug('back',back)
// debug('fore',fore)

// arrays of objects
const a = [{a:1},{b:2},{d:4}]
const b = [{b:2},{c:3},{d:44}]
const diff = diffstory.diff(a,b)
debug('diff',diff)
const back = diffstory.backward(diff)
const fore = diffstory.forward(diff)
debug('back',back)
debug('fore',fore)

// boolean
// const a = true
// const b = false
// const diff = diffstory.diff(a,b)
// debug('diff',diff)
// debug('old '+diff['-val'])
// debug('new '+diff['+val'])
// const back = diffstory.backward(diff)
// const fore = diffstory.forward(diff)
// debug('back',back)
// debug('fore',fore)

// number
// const a = 1
// const b = 2
// const diff = diffstory.diff(a,b)
// debug('diff',diff)
// debug('old '+diff['-val'])
// debug('new '+diff['+val'])
// const back = diffstory.backward(diff)
// const fore = diffstory.forward(diff)
// debug('back',back)
// debug('fore',fore)

// string
// const a = "ab"
// const b = 'bc'
// const diff = diffstory.diff(a,b)
// debug('diff',diff)
// const back = diffstory.backward(diff)
// const fore = diffstory.forward(diff)
// debug('back',back)
// debug('fore',fore)

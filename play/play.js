// This is code to play around with

const diffstory = require('../src/diff')
// const jsdiff = require('diff')


const sameId = (o1,o2) => (o1.id===o2.id)

a = [{id:1,val:"happy"}/*,{id:0,val:'blah'}*/]
b = [{id:1,val:"sad"}]
options = { sameId: sameId, words:true }
// options = { }

// console.log(sameId({id:1},{id:1}))

// console.log(JSON.stringify(options,null,2))

// function isDefined(o) { return typeof o !== 'undefined' }

// console.log(isDefined(options.sameId))

// options = { }

const d = diffstory.diff(a, b, options)

console.log(JSON.stringify(d,null,2))


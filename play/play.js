// This is code to play around with

const diffstory = require('../src/diff')

// let a = { 
//   items: [
//     { name: 'joe' }
//   ] 
// }

// let b = { 
//   items: [
//     { name: 'joe', age: 32 }
//   ] 
// }

// let a = [
//   { name: 'joe' }
// ] 

// let b = [
//   { name: 'joe', age: 32 }
// ] 

// let a = [{a:1},{b:2}]
// let b = [{b:2},{a:1}]
// let a = [{a:1}]
// let b = [{a:2}]

let a = { items:[{name:'joe'}] }
let b = { items:[{name:'joe',age:32}] }

let d = diffstory.diff(a,b)

console.log(JSON.stringify(d,null,2))

// let bb = diffstory.forward(a,d)

// console.log(JSON.stringify(bb,null,2))

let aa = diffstory.backward(b,d)

console.log(JSON.stringify(aa,null,2))


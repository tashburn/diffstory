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

let a = [{a:1}]
let b = [{a:2}]

let op = diffstory.operations(a,b)

console.log(JSON.stringify(op,null,2))

let before = diffstory.operationBefore(op)

console.log(JSON.stringify(before,null,2))

let after = diffstory.operationAfter(op)

console.log(JSON.stringify(after,null,2))





// // ex: objectMap(a, (k,v) => [k,v+10])
// function objectMap(o, fn) {
//   const ret = {}
//   for (let [k,v] of Object.entries(o)) {  
//     let [k2,v2] = fn(k,v)
//     ret[k2] = v2
//   }
//   return ret
// }


// // ex: objectFilter(a, (k,v) => v===2)
// function objectFilter(o, fn) {
//   const ret = {}
//   for (let [k,v] of Object.entries(o)) {  
//     let keep = fn(k,v)
//     if (keep===true)
//       ret[k] = v
//   }
//   return ret
// }


// module.exports.objectMap = objectMap
// module.exports.objectFilter = objectFilter


Object.prototype.map = function(fn) {
  const ret = {}
  for (let [k,v] of Object.entries(this)) {  
    let [k2,v2] = fn(k,v)
    ret[k2] = v2
  }
  return ret
}


Object.prototype.filter = function(fn) {
  const ret = {}
  for (let [k,v] of Object.entries(this)) {  
    let keep = fn(k,v)
    if (keep===true)
      ret[k] = v
  }
  return ret
}


// ex: objectMap(a, (k,v) => [k,v+10])
function objectMap(o, fn) {
  const ret = {}
  for (let [k,v] of Object.entries(o)) {  
    let [k2,v2] = fn(k,v)
    ret[k2] = v2
  }
  return ret
}


// ex: objectFilter(a, (k,v) => v===2)
function objectFilter(o, fn) {
  const ret = {}
  for (let [k,v] of Object.entries(o)) {  
    let keep = fn(k,v)
    if (keep===true)
      ret[k] = v
  }
  return ret
}


function map(o, fn) {
  if (identify.isArray(o))
    return o.map(fn)
  else if (identify.isObject(o))
    return objectMap(o, fn)
  else
    throw 'not an array or object'
}


function filter(o, fn) {
  if (identify.isArray(o))
    return o.filter(fn)
  else if (identify.isObject(o))
    return objectFilter(o, fn)
  else
    throw 'not an array or object'
}


module.exports.map = map
module.exports.filter = filter


// Object.prototype.map = function(fn) {
//   const ret = {}
//   for (let [k,v] of Object.entries(this)) {  
//     let [k2,v2] = fn(k,v)
//     ret[k2] = v2
//   }
//   return ret
// }


// Object.prototype.filter = function(fn) {
//   const ret = {}
//   for (let [k,v] of Object.entries(this)) {  
//     let keep = fn(k,v)
//     if (keep===true)
//       ret[k] = v
//   }
//   return ret
// }
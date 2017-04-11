const diffstory = require('../src/diff')
const { 
  OLD_VALUE,
  NEW_VALUE,

  ADD_PROP, 
  REMOVE_PROP, 
  UPDATE_PROP, 
  KEEP_PROP,

  ADD_ITEM, 
  REMOVE_ITEM, 
  UPDATE_ITEM, 
  CUT_ITEM, 
  PASTE_ITEM, 
  SKIP_ITEM,
  KEEP_ITEM,

} = require('../src/instructions')


test('booleans', () => {
  run(
    true, 
    false, 
    { [OLD_VALUE]:true, [NEW_VALUE]:false }
  )
})

test('numbers', () => {
  run(
    1,
    2,
    { [OLD_VALUE]:1, [NEW_VALUE]:2 }
  )
})

test('strings', () => {
  run(
    'ab',
    'bc',
    '-"a"^"b"+"c"'
  )
})

// test('stringDiffToOperations', () => {
//   const ops = diffstory.stringDiffToOperations('-"a"^"b"+"c"')
//   expect(ops).toEqual([
//     {'-':'a'},
//     {'^':'b'},
//     {'+':'c'},
//   ])
// })

test('objects', () => {
  run(
    { a:1, b:2, c:3 },
    { a:1, b:20, d:4 },
    { [ADD_PROP]:{d:4}, [REMOVE_PROP]:{c:3}, [UPDATE_PROP]:{b:{[OLD_VALUE]:2,[NEW_VALUE]:20}} }
  )
})

test('array objects', () => {
  run(
    { items:[{name:'joe'}] },
    { items:[{name:'joe',age:32}] },
    { [UPDATE_PROP]: { 
      items: [
        {
          [UPDATE_ITEM]: {
            [ADD_PROP]: {age:32}
          } 
        }
      ]
      }
    }
  )
})

test('arrays', () => {
  run(
    [ 1,2 ],
    [ 2,3 ],
    [ {[REMOVE_ITEM]:[1]}, {[SKIP_ITEM]:1}, {[ADD_ITEM]:[3]} ]
  )
})

test('string operations', () => {
  let a = 'ab'
  let b = 'bc'
  const ops = diffstory.operations(a,b)
  expect(ops).toEqual([
    {'-':'a'},
    {'&':'b'},
    {'+':'c'},
  ])
  let after = diffstory.operationAfter(op)
  expect(after).toEqual(b)
  let before = diffstory.operationBefore(op)
  expect(before).toEqual(a)
})
test('object operations', () => {
  const a = { a:1, b:2 }
  const b = { b:2, c:3 }
  const ops = diffstory.operations(a,b)
  expect(ops).toEqual({
    [REMOVE_PROP]: { a: 1 },
    [KEEP_PROP]: { b: 2 },
    [ADD_PROP]: { c: 3 },
  })
})
test('array operations', () => {
  const a = [ 1,2 ]
  const b = [ 2,3 ]
  const ops = diffstory.operations(a,b)
  expect(ops).toEqual([
    { [REMOVE_ITEM]: [1] },
    { [KEEP_ITEM]: [2] },
    { [ADD_ITEM]: [3] },
  ])
})

test('verify', () => {
  const a = 'ab'  
  const b = 'bc'
  const d = diffstory.diff(a,b)
  const v = diffstory.verify(a,b,d)
  expect(v).toEqual(true)
})

// Utils

function run(fromStructure, toStructure, expectedDiff) {

  const a = fromStructure
  const b = toStructure

  const diff = diffstory.diff(a,b)
  expect(diff).toEqual(expectedDiff)
  
  const aa = diffstory.backward(b,diff)
  expect(aa).toEqual(a)
  
  const bb = diffstory.forward(a,diff)
  expect(bb).toEqual(b)
}

const diffstory = require('../src/diff')
const { 
  OLD_VALUE,
  NEW_VALUE,

  ADD_PROP, 
  REMOVE_PROP, 
  UPDATE_PROP, 

  ADD_ITEM, 
  REMOVE_ITEM, 
  UPDATE_ITEM, 
  CUT_ITEM, 
  PASTE_ITEM, 
  SKIP_ITEM,

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

test('stringDiffToOperations', () => {
  const ops = diffstory.stringDiffToOperations('-"a"^"b"+"c"')
  expect(ops).toEqual([
    {'-':'a'},
    {'^':'b'},
    {'+':'c'},
  ])
})

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
    { [UPDATE_PROP]: { items:[{[ADD_PROP]:{age:32}}] } }
  )
})

test('arrays', () => {
  run(
    [ 1,2 ],
    [ 2,3 ],
    [ {[REMOVE_ITEM]:[1]}, {[SKIP_ITEM]:1}, {[ADD_ITEM]:[3]} ]
  )
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

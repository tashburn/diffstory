const diffstory = require('../src/diff')

test('booleans', () => {
  run(
    true, 
    false, 
    { old:true, new:false }
  )
})

test('numbers', () => {
  run(
    1,
    2,
    { old:1, new:2 }
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
    { add:{d:4}, remove:{c:3}, update:{b:{old:2,new:20}} }
  )
})

test('arrays', () => {
  run(
    [ 1,2 ],
    [ 2,3 ],
    [ {remove:[1]}, {skip:1}, {add:[3]} ]
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

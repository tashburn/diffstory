import diff from '../src/diff'

test('diff string', () => {
  const a = 'ab'
  const b = 'bc'
  expect(diff(a,b)).toBe('-"a"^1+"c"')
})

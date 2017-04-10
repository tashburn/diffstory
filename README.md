# diffstory

A diff library to assist in managing revision histories of common Javascript data structures.

- It's small and fast with minimal dependencies
- Handles objects, arrays, strings, numbers, booleans
- Can diff from one structure to the other, even if different types
- Produces small human-readable diffs
- Diffs are composed of basic non-cyclic Javascript structures that are easily serializable and storable
- Can use a diff to "time-travel" a structure forward
- Can use a diff to "time-travel" a structure backwards
- Uses a fast "smallest common subsequence" algorithm for nice diffs of strings and arrays
- For objects, diffs can represent additions, removals, and updates
- For arrays, diffs can represent additions, removals, and also (for elements that are objects or arrays) updates and single-member reorderings.
- For strings, the diff is a compact string-based format, which can be converted to a processable "list of operations"

## Installation

```
npm i --save diffstory
```

## Basic Usage

```
import diffstory from 'diffstory'

const obj1 = { a:1, b:2 }
const obj2 = { b:20, c:3 }
const diff = diffstory.diff(obj1, obj2) 

// diff is { 
//   add: {c:3}, 
//   remove: {a:1}, 
//   update: {b:{old:2,new:20}}
// }
```

## Diffing Objects

Additions
```
const a = { a:1 }
const b = { a:1, b:2 }
const d = diffstory.diff(a,b)

// d is { add:{b:2} }
```

Removals
```
const a = { k1:1, k2:2 }
const b = { k1:1 }
const d = diffstory.diff(a,b)

// d is { remove:{k2:2} }
```

Updates
```
const a = { k1:1 }
const b = { k1:2 }
const d = diffstory.diff(a,b)

// d is { update:{k1:2} }
```

## Diffing Arrays

Additions
```
const a = [1]
const b = [1,2]
const d = diffstory.diff(a,b)

// d is [ {skip:1}, {add:[2]} ]
```

Removals
```
const a = [1,2]
const b = [1]
const d = diffstory.diff(a,b)

// d is [ {skip:1}, {remove:[2]} ]
```

Updates
```
const a = [{k:1}]
const b = [{k:2}]
const d = diffstory.diff(a,b)

// d is [ {update:{k:{old:1,new:2}}} ]
```

Single-Member Reorderings
```
const a = [1,2,{k:1}]
const b = [{k:1},1,2]
const d = diffstory.diff(a,b)

// d is [ {paste1:1}, {skip:2}, {cut1:1} ]
```

## Diffing Strings

For strings, a "longest common subsequence" algorithm is used to produce diffs in a compact string format like `'-"a"^1+"c"'`. This format is used so that its type (string) could be used to distinguish it from other kinds of diffs in complex nested diff representations. However, you can convert this format to a nice array of operations for processing.

Additions
```
const d = diffstory.diff('-"a"^1+"c"')

// d is '^1+"b"' (^ means `skip`, + means `add`)
```

Removals
```
const d = diffstory.diff('ab','a')

// d is '^1-"b"' (^ means `skip`, - means `remove`)
```

## Processing String Diffs

A diff of strings like `'-"a"^1+"c"'` is compact but not very processable. You can get it as an array of operations instead, using `stringDiffToOperations`
```
const ops = diffstory.stringDiffToOperations('ab','bc')

// ops is [
//   {'-':"a"},
//   {'^':"b"},
//   {'+':"c"},
// ]
```

## Applying Diffs

Forward
```
const a = "ab"
const b = "a"
const d = diffstory.diff(a,b)
bb = diffstory.forward(a,d)

// b === bb
```

Backward
```
const a = "ab"
const b = "a"
const d = diffstory.diff(a,b)
a = diffstory.backward(a,d)

// a === aa
```

## Verifying Diffs

To ensure integrity, you can verify that a diff works forwards and backwards.
```
const a = "ab"
const b = "a"
const d = diffstory.diff(a,b)
const ok = diffstory.verify(a,b,d)

// ok === true
```

## Future work

- Compact diffs of multiple-member reorderings when the members are objects or arrays (currently handles just single-member reorderings)
- Compact handling of array member duplication when the members are objects or arrays (currently treated as additions)

# diffstory

A diff library for common Javascript structures that --
- is small and fast with minimal dependencies
- handles objects, arrays, strings, numbers, booleans (the "supported types")
- can diff from one structure to the other, even if different types
- produces small human-readable diffs
- diffs are composed of basic Javascript structures that are easily serializable
- can use a diff to "time-travel" a structure forward
- can use a diff to "time-travel" a structure backwards
- uses a fast "smallest common subsequence" algorithm for nice diffs of strings and arrays
- for objects, diffs can represent additions, removals, and updates
- for arrays, diffs can represent additions, removals, and also (for elements that are objects or arrays) updates and single-member reorderings.
- for strings, the diff is a compact string-based format, which can be converted to a processable "list of operations"

The intention of this library is to assist in managing revision histories of data structures.

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
//   add:{c:3}, 
//   remove:{a:1}, 
//   update:{b:{old:2,new:20}}
// }
```

## Diffing Objects

Additions
```
diffstory.diff(
  { a:1 },
  { a:1, b:2 }) 

// returns { add:{b:2} }
```

Removals
```
a = { k1:1, k2:2 }
b = { k1:1 }
diffstory.diff(a,b)
// returns { remove:{k2:2} }
```

Updates
```
a = { k1:1 }
b = { k1:2 }
diffstory.diff(a,b)
// returns { update{k1:2} }
```

## Diffing Arrays

Additions
```
a = [1]
b = [1,2]
diffstory.diff(a,b)
// returns [ {skip:1}, {add:[2]} ]
```

Removals
```
a = [1,2]
b = [1]
diffstory.diff(a,b)
// returns [ {skip:1}, {remove:[2]} ]
```

Updates
```
a = [{k:1}]
b = [{k:2}]
diffstory.diff(a,b)
// returns [{update:{k:{old:1,new:2}}}]
```

Single-Member Reorderings
```
a = [1,2,{k:1}]
b = [{k:1},1,2]
diffstory.diff(a,b)
// returns [{paste1:1},{skip:2},{cut1:1}]
```

## Diffing Strings

For strings, diffs use "longest common subsequence" diffing in a compact format. The format was made a string so its type could be used to distinguish it from other kinds of diffs, especially when we diff complex nested structures.

Additions
```
diffstory.diff('a','ab')

// returns '^1+"b"' (^ means `skip`, + means `add`)
```

Removals
```
diffstory.diff('ab','a')

// returns '^1-"b"' (^ means `skip`, - means `remove`)
```

## Processing String Diffs

A diff of strings like `'-"a"^1+"c"'` is compact but not very processable. You can get it as an array of operations instead --
```
[
  {'-':"a"},
  {'^':1},
  {'+':"c"},
]
```

To diff two strings directly to an array of operations, use `diffStringsToOperations`.
```
const ops = diffstory.diffStringsToOperations('ab','a')

// ops is [
//   {'^':1},
//   {'-':"b"}
// ]
```

To convert an existing diff of strings to an array of operations, use `stringDiffToOperations`.
```
const ops = diffstory.stringDiffToOperations('^1-"b"')

// ops is [
//   {'^':1},
//   {'-':"b"}
// ]
```

## Applying Diffs

Forward
```
const a = "ab"
const b = "a"
diffstory.diff(a,b)
bb = diffstory.forward(a,diff)
// b === bb
```

Backward
```
const a = "ab"
const b = "a"
diffstory.diff(a,b)
a = diffstory.backward(a,diff)
// a === aa
```

## Future work

- Compact diffs of multiple-member reorderings when the members are objects or arrays (currently handles just single-member reorderings)
- Compact handling of array member duplication when the members are objects or arrays (currently treated as additions)

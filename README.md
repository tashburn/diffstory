# jsdiff

A diff library for Javascript structures (objects, arrays, strings, numbers, booleans) that --
- is light as air
- is fast as Cheetah
- produces small human-readable diffs
- can use a diff to "time-travel" a structure forward
- can use a diff to "time-travel" a structure backwards
- uses a fast "smallest common subsequence" algorithm for string and array diffs
- for objects, diffs represent additions, removals, and updates
- for arrays, diffs represent additions, removals, updates (for objects and arrays), and single-member reorderings.
- for strings, the diff is a compact format

It can diff from one structure to another, as long as that structure is a boolean, number, string, object, or array. Containers (objects, arrays) must contains only booleans, numbers, strings, objects, and arrays.

The code is ES6, so you may need something like Babel.

## Objects

Additions
```
import jsdiff from 'jsdiff
a = { k1:1 }
b = { k1:1, k2:2 }
const diff = jsdiff.diff(a,b)
// diff is { add:{k2:2} }
```

Removals
```
import jsdiff from 'jsdiff
a = { k1:1, k2:2 }
b = { k1:1 }
const diff = jsdiff.diff(a,b)
// diff is { remove:{k2:2} }
```

Updates
```
import jsdiff from 'jsdiff
a = { k1:1 }
b = { k1:2 }
const diff = jsdiff.diff(a,b)
// diff is { update{k1:2} }
```

## Arrays

Additions
```
import jsdiff from 'jsdiff
a = [1]
b = [1,2]
const diff = jsdiff.diff(a,b)
// diff is [ {skip:1}, {add:[2]} ]
```

Removals
```
import jsdiff from 'jsdiff
a = [1,2]
b = [1]
const diff = jsdiff.diff(a,b)
// diff is [ {skip:1}, {remove:[2]} ]
```

Updates
```
import jsdiff from 'jsdiff
a = [{k:1}]
b = [{k:2}]
const diff = jsdiff.diff(a,b)
// diff is [{update:{k:{old:1,new:2}}}]
```

Single-Member Reorderings
```
import jsdiff from 'jsdiff
a = [1,2,{k:1}]
b = [{k:1},1,2]
const diff = jsdiff.diff(a,b)
// diff is [{paste1:1},{skip:2},{cut1:1}]
```

## Strings

For strings, diffs use "longest common subsequence" diffing in a compact format.

Additions
```
import jsdiff from 'jsdiff
a = "a"
b = "ab"
const diff = jsdiff.diff(a,b)
// diff is '^1+"b"' (^ means `skip`, + means `add`)
```

Removals
```
import jsdiff from 'jsdiff
a = "ab"
b = "a"
const diff = jsdiff.diff(a,b)
// diff is '^1-"b"' (^ means `skip`, - means `remove`)
```

## Combinations

Complex nested objects are handled too.

## Applying a diff

Forward
```
import jsdiff from 'jsdiff
a = "ab"
b = "a"
const diff = jsdiff.diff(a,b)
bb = jsdiff.forward(a,diff)
// b === bb
```

Backward
```
import jsdiff from 'jsdiff
a = "ab"
b = "a"
const diff = jsdiff.diff(a,b)
a = jsdiff.backward(a,diff)
// a === aa
```

## Future work

- Compact multiple-member reorderings (currently compacts just single-member reorders)
- Compact handling of array member duplication (currently just treated as additions)

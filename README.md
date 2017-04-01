# jsdiff

A diff library for Javascript objects that's --
- small
- fast
- produces small two-way diffs
- can apply a diff forwards
- can apply a diff backwards
- diffs strings and arrays using a fast "smallest common subsequence" algorithm
- for objects, can handle key additions, removals, and updates
- for arrays, can handle additions, removals, updates (for objects and arrays), and single-member reorderings.
- for strings, the diff is a compact format

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

Single-member Reorderings
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

## Future work

- Compact multiple-member reorderings (currently compacts just single-member reorders)
- Compact handling of array member duplication (currently just treated as additions)

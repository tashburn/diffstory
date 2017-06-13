
[] revert back to skips and cuts for compact diffs

[] in array operations, have first pass return non-aggregated individual arrays of items in +item and -item, then sense updates (adjacent remove/add), then aggregate adjacent adds into a big add, and adjacent removes into big removes.

  const a = [ {a:1}, {b:2}, {c:3} ]

  const b = [ {b:2}, {c:30}, {d:4} ]

  const ops = diffstory.operations(a,b)

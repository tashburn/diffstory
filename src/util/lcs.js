import isEqual from 'lodash/isEqual'


export function longestCommonSubstring(str1, str2){

  if (!str1 || !str2)
    return {
      offset1: 0,
      offset2: 0,
      length: 0,
    };
 
  const len1 = str1.length
  const len2 = str2.length
  const num = new Array(len1)
  let maxlen = 0
  let lastSubsBegin = 0
 
  for (let i = 0; i < len1; i++) {
    let subArray = new Array(len2);
    for (let j = 0; j < len2; j++)
      subArray[j] = 0;
    num[i] = subArray;
  }
  let thisSubsBegin = null;
  let offset2 = null
  for (let i = 0; i < len1; i++) {
    for (let j = 0; j < len2; j++) {
      // if (str1[i] !== str2[j])
      if (!isEqual(str1[i], str2[j]))
        num[i][j] = 0
      else {
        if ((i === 0) || (j === 0))
          num[i][j] = 1
        else
          num[i][j] = 1 + num[i - 1][j - 1]
 
        if (num[i][j] > maxlen) {
          maxlen = num[i][j]
          thisSubsBegin = i - num[i][j] + 1
          offset2 = j - num[i][j] + 1
          if (lastSubsBegin !== thisSubsBegin) {
            // reset the string builder if a different LCS is found
            lastSubsBegin = thisSubsBegin
          }
        }
      }
    }
  }
  return {
    offset1: thisSubsBegin,
    offset2: offset2,
    length: maxlen,
  }
}


export function longestCommonSubsequence(arr1, arr2){

  if (!arr1 || !arr2) return { offset1: 0, offset2: 0, length: 0 }
 
  const len1 = arr1.length
  const len2 = arr2.length
  const num = new Array(len1)
  let maxlen = 0
  let lastSubsBegin = 0

  for (let i = 0; i < len1; i++) {
    let subArray = new Array(len2)
    for (let j = 0; j < len2; j++)
      subArray[j] = 0
    num[i] = subArray
  }

  let thisSubsBegin = null
  let offset2 = null // trent
  for (let i = 0; i < len1; i++) {
    for (let j = 0; j < len2; j++) {

      // if (arr1[i] !== arr2[j])
      if (!isEqual(arr1[i], arr2[j]))
        num[i][j] = 0;
      else {
        if ((i === 0) || (j === 0))
          num[i][j] = 1
        else
          num[i][j] = 1 + num[i - 1][j - 1]
 
        if (num[i][j] > maxlen) {
          maxlen = num[i][j]
          thisSubsBegin = i - num[i][j] + 1
          offset2 = j - num[i][j] + 1
          if (lastSubsBegin !== thisSubsBegin) { 
            // reset the string builder if a different LCS is found
            lastSubsBegin = thisSubsBegin
          }
        }
      }
    }
  }
  return {
    offset1: thisSubsBegin,
    offset2: offset2,
    length: maxlen,
  }
}


export default { longestCommonSubstring, longestCommonSubsequence }
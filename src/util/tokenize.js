
/*
This
  "one two  three"
is tokenized into
  "one", "two", "three"
*/
function tokenizeWords(s) {
  const words = s.split(' ')
  return words
  // const tokens = []
  // for (let ix in words) {
  //   const word = words[ix]
  //   tokens.push(word)
  //   // if (ix < words.length-1)
  //     // tokens.push(" ")
  // }
  // return tokens
}

module.exports = { tokenizeWords }
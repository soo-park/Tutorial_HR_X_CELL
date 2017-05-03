
const getRange = function(fromNum, toNum) {
  return Array.from({length: toNum - fromNum + 1},
    (unused, i) => i + fromNum);
};

const getLetterRange = function(firstLetter = '@', numLetters) {
  // GET UNICODE VALUE: .charCodeAt(index)
  // get numeric Unicode code point of the character at the index of the string
  // eg. charracter is "A" >> code is 65
  const rangeStart = firstLetter.charCodeAt(0);
  const rangeEnd = rangeStart + numLetters -1;
  return getRange(rangeStart, rangeEnd)
    // TURN THE UNICODE VALUE INTO CHARACTER: .fromCharCode(unicode)
    // produce the char that corresponds to the given Unicode code point
    .map(charCode => { 
      let char = String.fromCharCode(charCode)
      if (char === "@") {
        char = ""
      }
      return char; });
};

module.exports = {
  getRange: getRange,
  // when adding a new function, don't forget to add to export
  // otherwise, you get "cannot find" error
  getLetterRange: getLetterRange
};
class TableModel {
  constructor(numCols=10, numRows=20) {
    this.numCols = numCols;
    this.numRows = numRows;
    this.data = {};
  }

  _getCellId(location) {
    return `${location.col}:${location.row}`;
  }

  getValue(location) {
    return this.data[this._getCellId(location)];
  }

  setValue(location, value) {
    this.data[this._getCellId(location)] = value;
  }


  // accessors: setting and getting
  incrementColNum() {
    this.numCols += 1;
  }

  incrementRowNum() {
    this.numRows += 1;
  }

  // accessors: setting and getting
  decrementColNum() {
    this.numCols -= 1;
  }

  decrementRowNum() {
    this.numRows -= 1;
  }


}

module.exports = TableModel;
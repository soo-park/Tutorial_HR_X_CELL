(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const TableModel = require('./table-model');
const TableView = require('./table-view');

const model = new TableModel();
const tableView = new TableView(model);
tableView.init();

},{"./table-model":4,"./table-view":5}],2:[function(require,module,exports){

const getRange = function(fromNum, toNum) {
  return Array.from({length: toNum - fromNum + 1},
    (unused, i) => i + fromNum);
};

const getLetterRange = function(firstLetter = 'A', numLetters) {
  // GET UNICODE VALUE: .charCodeAt(index)
  // get numeric Unicode code point of the character at the index of the string
  // eg. charracter is "A" >> code is 65
  const rangeStart = firstLetter.charCodeAt(0);
  const rangeEnd = rangeStart + numLetters -1;
  return getRange(rangeStart, rangeEnd)
    // TURN THE UNICODE VALUE INTO CHARACTER: .fromCharCode(unicode)
    // produce the char that corresponds to the given Unicode code point
    .map(charCode => String.fromCharCode(charCode));
};

module.exports = {
  getRange: getRange,
  // when adding a new function, don't forget to add to export
  // otherwise, you get "cannot find" error
  getLetterRange: getLetterRange
};
},{}],3:[function(require,module,exports){
const removeChildren = function(parentEl) {
  while (parentEl.firstChild) {
    parentEl.removeChild(parentEl.firstChild);
  }
};

const createEl = function(tagName) {
  return function(text) {
    // create element with particular tag name
    const el = document.createElement(tagName);
    if (text) {
    // put whatever given in between the opening/closing tags
      el.textContent = text;
    }
    return el;
  };
};

const createTR = createEl('TR');
const createTH = createEl('TH');
const createTD = createEl('TD');

module.exports = {
  createTR: createTR,
  createTH: createTH,
  createTD: createTD,
  removeChildren: removeChildren
};

},{}],4:[function(require,module,exports){
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
}

module.exports = TableModel;
},{}],5:[function(require,module,exports){
const { getLetterRange } = require('./array-util');
const { removeChildren, createTH, createTR, createTD } = require('./dom-util');

class TableView {
  constructor(model) {
    this.model = model;
  }

  init() {
    this.initDomReferences();
    this.initCurrentCell();
    this.renderTable();
    this.attachEventHandlers();
  }

  initDomReferences() {
    this.headerRowEl = document.querySelector('THEAD TR');
    this.sheetBodyEl = document.querySelector('TBODY');
    this.formulaBarEl = document.querySelector('#formula-bar');
  }

  initCurrentCell() {
    this.currentCellLocation = { col: 0, row: 0 };
    this.renderFormulaBar();
  }

  // to prevent value "undefined" showing in DOM, substitute the empty string
  normalizeValueForRendering(value) {
    return value || "";
  }

  renderFormulaBar() {
    const currentCellValue = this.model.getValue(this.currentCellLocation);
    this.formulaBarEl.value = this.normalizeValueForRendering(currentCellValue);
    this.formulaBarEl.focus();
  }

  renderTable() {
    this.renderTableHeader();
    this.renderTableBody();
   }

  renderTableHeader() {
    removeChildren(this.headerRowEl);
    // get letters and build elements
    getLetterRange('A', this.model.numCols)
      .map(colLabel => createTH(colLabel))
      .forEach(th => this.headerRowEl.appendChild(th));
  }

  isCurrentCell(col, row) {
    return this.currentCellLocation.col === col
           &&
           this.currentCellLocation.row === row;
  }

  renderTableBody() {
    // document fragment makes it possible to change part of the DOM
    // and then load the entire thing so that user will not see flickers
    const fragment = document.createDocumentFragment();
    for (let row = 0; row < this.model.numRows; row++) {
      const tr = createTR();
      for (let col = 0; col < this.model.numCols; col++) {
        const position = {col: col, row: row};
        const value = this.model.getValue(position);
        const td = createTD(value);
        tr.appendChild(td);

        if (this.isCurrentCell(col, row)) {
          td.className = 'current-cell';
        }
      }
      fragment.appendChild(tr);    
    }
    removeChildren(this.sheetBodyEl);
    this.sheetBodyEl.appendChild(fragment);
    this.renderSumRow()
  }

  renderSumRow() {
    // Find a <table> element with id="myTable":
    var tableBody = document.getElementById("sheet-current").getElementsByTagName('TBODY')[0];

    // Insert a row in the table at the last row
    var newRow = tableBody.insertRow(tableBody.rows.length);

    // make it possible to add CSS to the row
    newRow.className = 'sum-row';

    var width = this.model.numCols;
    var height = this.model.numRows;
    for (let i=0; i<width; i++) {
      // default value to add up
      var colSum = 0;
      for (let j=0; j<height; j++) {
        const position = {col: i, row: j};
        const value = this.model.getValue(position);
        if (!isNaN(value)) {
          // add the values
          colSum += Number(value);
        }
      }
      // pick the last row and set value the sum
      // insert a cell in the row at index 0
      var newValue = newRow.insertCell(i);

      // Append a new text node to the cell
      if (colSum != 0) {
        var newText = document.createTextNode(colSum);
        newValue.appendChild(newText);
      } else {
        var newText = document.createTextNode('');
        newValue.appendChild(newText);        
      }
    }
  }

  attachEventHandlers() {
    this.sheetBodyEl.addEventListener('click', this.handleSheetClick.bind(this));
    this.formulaBarEl.addEventListener('keyup', this.handleFormulaBarChange.bind(this));
    document.getElementById('add-col').addEventListener('click', this.handleAddColClick.bind(this));
    document.getElementById('add-row').addEventListener('click', this.handleAddRowClick.bind(this));
  }

  handleAddColClick(evt) {
    // pick the table
    var table = document.getElementById("sheet-current").getElementsByTagName('TBODY')[0];
    // in table, insert a row to the bottom to the next
    var rows = table.getElementsByTagName('TR')
    var currentNumRow = rows.length;
    var currentNumCol = rows[0].getElementsByTagName('TD').length;
    for (let i=0; i < currentNumRow-1; i++) {
      console.log();
    } 
  }

  handleAddRowClick(evt) {
    // this.model.numRows = this.model.numRows + 1;
    // this.init();
  }

  handleFormulaBarChange(evt) {
    const value = this.formulaBarEl.value;
    this.model.setValue(this.currentCellLocation, value);
    this.renderTableBody();
  }

  handleSheetClick(evt) {
    const col = evt.target.cellIndex;
    const row = evt.target.parentElement.rowIndex-1;
  
    this.currentCellLocation = { col: col, row: row };
    this.renderTableBody();
    this.renderFormulaBar();
  }
}

module.exports = TableView;

},{"./array-util":2,"./dom-util":3}]},{},[1]);

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

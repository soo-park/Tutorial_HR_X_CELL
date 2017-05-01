// calls for JS file system
const fs = require('fs');
const TableModel = require('../table-model');
const TableView = require('../table-view');

describe('table-view', () => {
  it('makes changes TO the value of the current cell', () => {
    // set up the initial state
    const model = new TableModel(3, 3);
    const view = new TableView(model);
    view.init();

    // inspect the initial state
    let trs = document.querySelectorAll('TBODY TR');
    let td = trs[0].cells[0];
    expect(td.textContent).toBe('');

    // stimulate user action
    document.querySelector('#formula-bar').value = '65';
    view.handleFormulaBarChange();

    // inspect the resulting state
    trs = document.querySelectorAll('TBODY TR');
    expect(trs[0].cells[0].textContent).toBe('65');
  });

  beforeEach(() => {
    // load HTML skeleton from disk and parse into the DOM
    // the sheet-container.html is dupe of index.html
    // but Pug or React required to be DRY
    const fixturePath = './client/js/test/fixtures/sheet-container.html';
    // makes synchronous function to block all tasks until this is done
    // usually just "readFile" used, but since one-time function this OK
    const html = fs.readFileSync(fixturePath, 'utf8');
    document.documentElement.innerHTML = html;
  });

  describe('formula bar', () => {
    it('updates FROM the value of the current cell', () => {
      // set up the inital state
      const model = new TableModel(3, 3);
      const view = new TableView(model);
      model.setValue({ col: 2, row: 1 }, '123');
      view.init();

      // inspect the inital state
      const formulaBarEl = document.querySelectorAll('#formula-bar');
      // FIXME: test returns undefined instead of ''  (section 40)
      expect(formulaBarEl.value).toBe('');

      // simulater user action
      const trs = document.querySelectorAll('TBODY TR');
      trs[1].cells[2].click();

      // inspect the resulting state
      expect(formulaBarEl.value).toBe('123');
    })
  })

  describe('table body', () => {
    it('highlights the current cell when clicked', () => {
      // set up the initial state
      const model = new TableModel(10, 5);
      const view = new TableView(model);
      view.init();

      // inspect the initial state
      let trs = document.querySelectorAll('TBODY TR');
      let td = trs[2].cells[3];
      expect(td.className).toBe('');

      // simulate user action
      td.click();

      // inspet the resulting state
      trs = document.querySelectorAll('TBODY TR');
      td = trs[2].cells[3];
      expect(td.className).not.toBe('');
    });

    it('has the right size', () => {
      // set up the initial state
      const numCols = 6;
      const numRows = 10;
      const model = new TableModel(numCols, numRows);
      const view = new TableView(model);
      view.init();

      // inspect the initial state
      let ths = document.querySelectorAll('THEAD TH');
      expect(ths.length).toBe(numCols);
    });

    it('fills in values from the model', () => {
      // set up the initial state
      const model = new TableModel(3, 3);
      const view = new TableView(model);
      model.setValue({col:2, row: 1}, '123');
      view.init()

      // inspect the initial state
      const trs = document.querySelectorAll('TBODY TR');
      expect(trs[1].cells[2].textContent).toBe('123');      
    });
  });

  describe('table header', () => {
    it('has valid column header labels', () => {
      // set up the initial state
      const numCols = 6;
      const numRows = 10;
      const model = new TableModel(numCols, numRows);
      const view = new TableView(model);
      view.init();

      // inspect the inital state
      let ths = document.querySelectorAll('THEAD TH');
      expect(ths.length).toBe(numCols);

      // inspect the resulting state
      let labelTexts = Array.from(ths).map(el => el.textContent);
      expect(labelTexts).toEqual(['A', 'B', 'C', 'D', 'E', 'F']);
    });
  });

});
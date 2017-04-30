const TableModel = require('./table-model');
const TableView = require('./table-view');

const model = new TableModle();
const tableView = new TableView(model);
tableView.init();

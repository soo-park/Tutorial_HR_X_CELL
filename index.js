const http = require('http');
const express = require('express');
const app = express();

// have the Express to server our client side files from a folder
app.use(express.static('public'));

// set default port to 3000, but have it accept input from env if deployed
app.set('port', process.env.PORT || 3000);

const server = http.createServer(app);
server.listen(app.get('port'), () => {
  console.log(`Server listning on port ${app.get('port')}...`);
});
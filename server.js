require('dotenv').config();
var app = require('./app');
var http = require('http');

var httpServer = http.createServer(app);

const httpPort = process.env.HTTP_PORT;


httpServer.listen(httpPort, ()=> {console.log('http on '+httpPort)});
httpServer.setTimeout(120000);
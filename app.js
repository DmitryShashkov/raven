var config = require('./public/config');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var router = require('./server/router');
var WebSocketServer = new require('ws');
var api = require('./server/controllers/api');
var server = require('http').createServer();

//initialize the app
var app = express();

//set up static files directory
app.use(express.static(path.join(__dirname, config.server.staticDir)));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(router);

// app.listen(process.env.PORT || config.server.port, function () {
//     console.log('Express listening at port ' + config.server.port);
// });

var webSocketServer = new WebSocketServer.Server({server: server});

console.log('WS listening');

webSocketServer.on('connection', function(ws) {
    api.initiate(ws);
    ws.on('message', api.processMessage);
});

server.on('request', app);
server.listen(process.env.PORT || config.server.port, function () { console.log('Listening on ' + server.address().port) });
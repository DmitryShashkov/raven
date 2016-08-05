var config = require('./public/config');
var express = require('express');
var bodyParser = require('body-parser');
var ws = require('./server/sockets');
var path = require('path');
var router = require('./server/router');

//initialize the app
var app = express();

//set up static files directory
app.use(express.static(path.join(__dirname, config.server.staticDir)));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(router);

app.listen(process.env.PORT || config.server.port, function () {
    console.log('Express listening at port ' + config.server.port);
});
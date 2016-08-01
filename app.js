var config = require('./config');
var express = require('express');
var bodyParser = require('body-parser');
var router = require('./server/router');

//initialize the app
var app = module.exports = express();

//set up static files directory
app.use(express.static(__dirname  + config.server.staticDir));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(router);

app.listen(config.server.port, function () {
    console.log('Web server successfully started at port ' + config.server.port);
});
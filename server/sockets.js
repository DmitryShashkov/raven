var config = require('./../public/config');
var WebSocketServer = new require('ws');

var webSocketServer = new WebSocketServer.Server({
    port: config.server.portWS
});

console.log('WS listening at port ' + config.server.portWS);

var defaultSettings = {
    type: 'initial',
    settings: {
        width: 11,
        height: 13
    }
};

webSocketServer.on('connection', function(ws) {
    console.log('New connection!');

    ws.on('message', function(message) {
        console.log('Received: ' + message);
    });

    ws.on('close', function() {
        console.log('Connection closed');
    });

});

var config = require('./../public/config');
var WebSocketServer = new require('ws');
var api = require('./controllers/api');

var webSocketServer = new WebSocketServer.Server({
    port: config.server.portWS
});

console.log('WS listening at port ' + config.server.portWS);

function processMessage (received, ws) {
    var message = JSON.parse(received);
    switch (message.type) {
        case 'request-game-creation':
            api.addGame(message.data);
            break;
        case 'request-joining-game':
            api.joinGame(message.data);
            break;
    }
}

webSocketServer.on('connection', function(ws) {
    api.initiate(ws);
    ws.on('message', processMessage);
});

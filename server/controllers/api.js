var config = require('../../public/config');
var underscore = require('underscore');

var api = {};
var clients = [];
var games = [];

function broadcast (message) {
    clients.forEach(function (client) {
        try {
            client.ws.send(JSON.stringify(message));
        } catch (exc) {
            console.log(exc);
        }
    });
}

api.initiate = function (ws) {
    var newClient = {
        id: 'u' + (new Date()).valueOf(),
        ws: ws
    };
    clients.push(newClient);

    var initialMessage = {
        type: 'initiate',
        data: {
            id: newClient.id,
            gamesList: games
        }
    };
    newClient.ws.send(JSON.stringify(initialMessage));
    console.log('New connection: ' + newClient.id);
    ws.on('close', function() {
        clients = underscore.without(clients, underscore.findWhere(clients, {
            id: newClient.id
        }));
        removeParticipantByID(newClient.id);
        removeGameByOwnerID(newClient.id);
        console.log('Connection closed: ' + newClient.id);
    });
};


function removeGameByOwnerID (ownerID) {
    var owners = games.map(function (game) {
        return game.owner;
    });
    games = underscore.without(games, underscore.findWhere(games, {
        owner: underscore.findWhere(owners, {
            id: ownerID
        })
    }));
    broadcast({
        type: 'games-list-updated',
        data: {
            newGamesList: games
        }
    });
}
function removeParticipantByID (playerID) {
    games.forEach(function (game) {
        var thatGuy = underscore.findWhere(game.participants, {
            id: playerID
        });
        game.participants = underscore.without(game.participants, thatGuy);
    });
}

api.addGame = function (messageData) {
    removeGameByOwnerID(messageData.ownerID);
    removeParticipantByID(messageData.ownerID);
    games.push({
        owner: {
            id: messageData.ownerID,
            name: messageData.ownerName,
        },
        participants: []
    });
    broadcast({
        type: 'games-list-updated',
        data: {
            newGamesList: games
        }
    });
};

api.joinGame = function (messageData) {
    removeGameByOwnerID(messageData.playerID);
    removeParticipantByID(messageData.playerID);
    var owners = games.map(function (game) {
        return game.owner;
    });
    var targetGame = underscore.findWhere(games, {
        owner: underscore.findWhere(owners, {
            id: messageData.ownerID
        })
    });
    targetGame.participants.push({
        id: messageData.playerID,
        name: messageData.playerName
    });
    broadcast({
        type: 'games-list-updated',
        data: {
            newGamesList: games
        }
    });
};

api.leaveGame = function (messageData) {
    removeParticipantByID(messageData.playerID);
    broadcast({
        type: 'games-list-updated',
        data: {
            newGamesList: games
        }
    });
};

api.disbandGame = function (messageData) {
    removeGameByOwnerID(messageData.ownerID);
    broadcast({
        type: 'games-list-updated',
        data: {
            newGamesList: games
        }
    });
};

module.exports = api;

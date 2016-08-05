var config = require('../../public/config');
var underscore = require('underscore');
var mapper = require('./../utils/mapper');

var api = {};
var clients = [];
var pendingGames = [];
var gamesInProgress = [];

function broadcast (message, recipients) {
    (recipients || clients).forEach(function (client) {
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
            gamesList: pendingGames
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
    var owners = pendingGames.map(function (game) {
        return game.owner;
    });
    pendingGames = underscore.without(pendingGames, underscore.findWhere(pendingGames, {
        owner: underscore.findWhere(owners, {
            id: ownerID
        })
    }));
    gamesInProgress = underscore.without(gamesInProgress, underscore.findWhere(gamesInProgress, {
        owner: underscore.findWhere(owners, {
            id: ownerID
        })
    }));
    broadcast({
        type: 'games-list-updated',
        data: {
            newGamesList: pendingGames
        }
    });
}
function removeParticipantByID (playerID) {
    pendingGames.forEach(function (game) {
        var thatGuy = underscore.findWhere(game.participants, {
            id: playerID
        });
        game.participants = underscore.without(game.participants, thatGuy);
    });
}

api.addGame = function (messageData) {
    removeGameByOwnerID(messageData.ownerID);
    removeParticipantByID(messageData.ownerID);
    pendingGames.push({
        owner: {
            id: messageData.ownerID,
            name: messageData.ownerName,
        },
        participants: []
    });
    broadcast({
        type: 'games-list-updated',
        data: {
            newGamesList: pendingGames
        }
    });
};

api.joinGame = function (messageData) {
    removeGameByOwnerID(messageData.playerID);
    removeParticipantByID(messageData.playerID);
    var owners = pendingGames.map(function (game) {
        return game.owner;
    });
    var targetGame = underscore.findWhere(pendingGames, {
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
            newGamesList: pendingGames
        }
    });
};

api.leaveGame = function (messageData) {
    removeParticipantByID(messageData.playerID);
    broadcast({
        type: 'games-list-updated',
        data: {
            newGamesList: pendingGames
        }
    });
};

api.disbandGame = function (messageData) {
    removeGameByOwnerID(messageData.ownerID);
    broadcast({
        type: 'games-list-updated',
        data: {
            newGamesList: pendingGames
        }
    });
};

api.processGameStart = function (messageData) {
    var owners = pendingGames.map(function (game) {
        return game.owner;
    });
    var targetGame = underscore.findWhere(pendingGames, {
        owner: underscore.findWhere(owners, {
            id: messageData.ownerID
        })
    });
    var newGameID = 'g' + (new Date()).valueOf();

    var map = mapper.getMap(targetGame.participants.length + 1); // + owner
    var recipients = targetGame.participants.map(function (participant) {
        return underscore.findWhere(clients, {
            id: participant.id
        });
    }).concat(underscore.findWhere(clients, {
        id: targetGame.owner.id
    }));
    broadcast({
        type: 'game-initiate',
        data: {
            map: map,
            gameID: newGameID
        }
    }, recipients);

    targetGame.id = newGameID;
    targetGame.map = map;
    recipients.forEach(function (client, index) {
        targetGame.map.elements.tanks[index].userID = client.id;
        client.ws.send(JSON.stringify({
            type: 'game-state-changed',
            data: {
                // color: targetGame.map.elements.tanks[index].color
                newElements: targetGame.map.elements
            }
        }));
    });

    removeGameByOwnerID(messageData.ownerID);
    gamesInProgress.push(targetGame);
};

api.processKeyPressed = function (messageData) {
    var targetGame = underscore.findWhere(gamesInProgress, {
        id: messageData.gameID
    });
    targetGame.map.elements = messageData.currentElements;
    var tanks = targetGame.map.elements.tanks;
    var triggeredTank = underscore.findWhere(tanks, {
        userID: messageData.playerID
    });
    var buttons = config.game.buttons;
    switch (messageData.keyCode) {
        case buttons.UP:
            triggeredTank.direction = 0;
            break;
        case buttons.RIGHT:
            triggeredTank.direction = 90;
            break;
        case buttons.DOWN:
            triggeredTank.direction = 180;
            break;
        case buttons.LEFT:
            triggeredTank.direction = 270;
            break;
    }
    var recipients = targetGame.participants.map(function (participant) {
        return underscore.findWhere(clients, {
            id: participant.id
        });
    }).concat(underscore.findWhere(clients, {
        id: targetGame.owner.id
    }));
    broadcast({
        type: 'game-state-changed',
        data: {
            // subType: 'direction',
            // tankColor: triggeredTank.color,
            // newDirection: triggeredTank.direction
            newElements: targetGame.map.elements
        }
    }, recipients);
};

module.exports = api;

var config = require('./../../public/config');
var underscore = require('underscore');

function getMap (playersAmount) {
    // will select map from stored list according to amount of players
    // one day
    var map = {
        width: config.game.defaults.mapWidth,
        height: config.game.defaults.mapHeight
    };
    var elements = {
        walls: [],
        shells: [],
        explosions: [],
        tanks: []
    };

    // placing walls
    var maxAmountOfWalls = Math.round(map.width * map.height / playersAmount);
    var i;
    for (i = 0; i < maxAmountOfWalls; i++) {
        var newWall = {
            row: Math.floor(Math.random() * map.height),
            col: Math.floor(Math.random() * map.width),
            type: config.game.types.WALL
        };
        if (!underscore.contains(elements.walls, newWall)) {
            elements.walls.push(newWall);
        }
    }

    // placing tanks
    for (i = 0; i < playersAmount; i++) {
        var foundPlace = false, col, row, crossesWall, crossesTank;
        while (!foundPlace) {
            row = Math.floor(Math.random() * map.height);
            col = Math.floor(Math.random() * map.width);
            crossesWall = underscore.contains(elements.walls, underscore.findWhere(elements.walls, {
                row: row,
                col: col
            }));
            crossesTank = underscore.contains(elements.tanks, underscore.findWhere(elements.tanks, {
                row: row,
                col: col
            }));
            foundPlace = !crossesWall && !crossesTank;
        }

        var direction = Math.floor(Math.random() * 4) * 90;
        var color = config.game.colors[Object.keys(config.game.colors)[i]];

        elements.tanks.push({
            row: row,
            col: col,
            type: config.game.types.TANK,
            direction: direction,
            color: color,
            isMoving: true
        });
    }

    map.elements = elements;
    return map;
}

module.exports = {
    getMap: getMap
};

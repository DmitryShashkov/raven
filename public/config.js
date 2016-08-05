var config = {
    server: {
        host: 'localhost',
        port: 80,
        portWS: 1981,
        staticDir: 'public'
    },
    client: {
        cellWidth: 40
    },
    game: {
        frequency: 125,
        maxPlayersAmount: 7,
        types: {
            WALL: 'wall',
            EXPLOSION: 'explosion',
            TANK: 'tank',
            SHELL: 'shell',
            EMPTY: 'empty'
        },
        colors: {
            RED: '#ff0000',
            GREEN: '#00ff00',
            BLUE: '#0000ff',
            AQUA: '#00ffff',
            FUCHSIA: '#ff00ff',
            YELLOW: '#ffff00',
            WHITE: '#ffffff'
        },
        buttons: {
            UP: 87,
            DOWN: 83,
            LEFT: 65,
            RIGHT: 68
        },
        defaults: {
            mapWidth: 20,
            mapHeight: 15
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
}
var config = {
    server: {
        host: 'localhost',
        port: 1337,
        portWS: 1981,
        staticDir: 'public'
    },
    client: {
        cellWidth: 40
    },
    game: {
        frequency: 125,
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
            YELLOW: '#00ffff'
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
}
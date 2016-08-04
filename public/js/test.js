var cfg = config.game;

var Cell = React.createClass({
    render: function () {
        var style = {
            backgroundImage: '',
            backgroundPosition: ''
        };
        var sets = this.props.settings;
        if (sets.type === cfg.types.WALL) {
            style.backgroundImage = 'url(img/bricks.png)';
        }
        if (sets.type === cfg.types.EXPLOSION) {
            style.backgroundImage = 'url(img/boom.png)';
            style.backgroundPosition = '-' + (sets.stage * config.client.cellWidth) + 'px 0';
        }
        if (sets.type === cfg.types.TANK) {
            style.backgroundImage = 'url(img/tank.png)';
            style.backgroundColor = sets.color;
            style.transform = 'rotate(' + sets.direction + 'deg)';
        }
        if (sets.type === cfg.types.SHELL) {
            style.backgroundImage = 'url(img/shell.png)';
            style.backgroundColor = sets.color;
        }
        return (
            <div className={'cell ' + sets.type}
                 style = {style}>
            </div>
        );
    }
});

var Row = React.createClass({
    render: function () {
        return (
            <div className="row">
                {
                    this.props.elements.map(function (element, index) {
                        return (
                            <Cell
                                settings={element}
                                key={index}
                            />
                        );
                    })
                }
            </div>
        );
    }
});

var ELEMENTS = {
    walls: [
        { col: 10, row: 0, type: cfg.types.WALL },
        { col: 10, row: 1, type: cfg.types.WALL },
        { col: 10, row: 2, type: cfg.types.WALL },
        { col: 10, row: 3, type: cfg.types.WALL },
        { col: 10, row: 4, type: cfg.types.WALL }
    ],
    explosions: [
        { col: 1, row: 2, type: cfg.types.EXPLOSION, stage: 2 }
    ],
    shells: [
        { col: 2, row: 3, type: cfg.types.SHELL, color: cfg.colors.RED },
        { col: 2, row: 5, type: cfg.types.SHELL, color: cfg.colors.GREEN },
        { col: 2, row: 7, type: cfg.types.SHELL, color: cfg.colors.BLUE },
        { col: 2, row: 9, type: cfg.types.SHELL, color: cfg.colors.YELLOW }
    ],
    tanks: [
        { col: 3, row: 3, type: cfg.types.TANK, direction: 90, color: cfg.colors.RED, isMoving: true },
        { col: 3, row: 5, type: cfg.types.TANK, direction: 90, color: cfg.colors.GREEN, isMoving: true },
        { col: 3, row: 7, type: cfg.types.TANK, direction: 90, color: cfg.colors.BLUE, isMoving: true },
        { col: 3, row: 9, type: cfg.types.TANK, direction: 90, color: cfg.colors.YELLOW, isMoving: true }
    ]
};

var width = 25;
var height = 10;

function processMessage (event) {
    var message = JSON.parse(event.data);

    console.log(message);
}

var Box = React.createClass({
    processMessage: processMessage,
    processTanks: function () {
        var state = this.state;
        this.state.elements.tanks.forEach(function (tank) {
            if (tank.isMoving) {
                switch (tank.direction) {
                    case 0: if ((tank.row > 0) && (state.grid[tank.row - 1][tank.col].type === cfg.types.EMPTY)) { tank.row--; } break;
                    case 90: if ((tank.col < width - 1) && (state.grid[tank.row][tank.col + 1].type === cfg.types.EMPTY)) { tank.col++; } break;
                    case 180: if ((tank.row < height - 1) && (state.grid[tank.row + 1][tank.col].type === cfg.types.EMPTY)) { tank.row++; } break;
                    case 270: if ((tank.col > 0) && (state.grid[tank.row][tank.col - 1].type === cfg.types.EMPTY)) { tank.col--; } break;
                }
            }
        });
        this.setState({
            elements: this.state.elements,
            grid: this.calculateGrid('state')
        });
    },
    processShells: function () {
        //console.log('shells');
    },
    shouldProcessTanks: true,
    processInteractions: function () {
        if (this.shouldProcessTanks) {
            this.processTanks();
        }
        this.processShells();
        this.shouldProcessTanks = !this.shouldProcessTanks;
    },
    calculateGrid: function (calculateBy) {
        var i;
        var grid = new Array(height);
        var elms = (calculateBy === 'props')
            ? this.props.initialElements
            : this.state.elements;
        var totalElements = elms.tanks.concat(elms.walls, elms.shells, elms.explosions);

        for (i = 0; i < height; i++) {
            grid[i] = new Array(width).fill({ type: 'empty' });
        }
        totalElements.forEach(function (element) {
            grid[element.row][element.col] = element;
        });
        return grid;
    },
    getDefaultProps: function () {
        var socket = new WebSocket('ws://localhost:1981');
        socket.onmessage = processMessage;
        return {
            initialElements: ELEMENTS,
            socket: socket
        };
    },
    getInitialState: function () {
        setInterval(this.processInteractions, config.game.frequency);

        return {
            grid: this.calculateGrid('props'),
            elements: this.props.initialElements
        }
    },
    render: function () {
        console.log('rendered');
        return (
            <div className="box">
                { this.state.grid.map(function (row, index) {
                    return (
                        <Row elements={row} key={index} />
                    );
                }) }
            </div>
        );
    }
});

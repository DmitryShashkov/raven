var cfg = config.game;

// var ELEMENTS = {
//     walls: [
//         { col: 10, row: 0, type: cfg.types.WALL },
//         { col: 10, row: 1, type: cfg.types.WALL },
//         { col: 10, row: 2, type: cfg.types.WALL },
//         { col: 10, row: 3, type: cfg.types.WALL },
//         { col: 10, row: 4, type: cfg.types.WALL }
//     ],
//     explosions: [
//         { col: 1, row: 2, type: cfg.types.EXPLOSION, stage: 2 }
//     ],
//     shells: [
//         { col: 2, row: 3, type: cfg.types.SHELL, color: cfg.colors.RED },
//         { col: 2, row: 5, type: cfg.types.SHELL, color: cfg.colors.GREEN },
//         { col: 2, row: 7, type: cfg.types.SHELL, color: cfg.colors.BLUE },
//         { col: 2, row: 9, type: cfg.types.SHELL, color: cfg.colors.YELLOW }
//     ],
//     tanks: [
//         { col: 3, row: 3, type: cfg.types.TANK, direction: 90, color: cfg.colors.RED, isMoving: true },
//         { col: 3, row: 5, type: cfg.types.TANK, direction: 90, color: cfg.colors.GREEN, isMoving: true },
//         { col: 3, row: 7, type: cfg.types.TANK, direction: 90, color: cfg.colors.BLUE, isMoving: true },
//         { col: 3, row: 9, type: cfg.types.TANK, direction: 90, color: cfg.colors.YELLOW, isMoving: true }
//     ]
// };

var GameBox = React.createClass({
    processTanks: function () {
        var state = this.state;
        this.state.elements.tanks.forEach(function (tank) {
            if (tank.isMoving) {
                switch (tank.direction) {
                    case 0: if ((tank.row > 0) && (state.grid[tank.row - 1][tank.col].type === cfg.types.EMPTY)) { tank.row--; } break;
                    case 90: if ((tank.col < this.props.globalSettings.map.width - 1) && (state.grid[tank.row][tank.col + 1].type === cfg.types.EMPTY)) { tank.col++; } break;
                    case 180: if ((tank.row < this.props.globalSettings.map.height - 1) && (state.grid[tank.row + 1][tank.col].type === cfg.types.EMPTY)) { tank.row++; } break;
                    case 270: if ((tank.col > 0) && (state.grid[tank.row][tank.col - 1].type === cfg.types.EMPTY)) { tank.col--; } break;
                }
            }
        }.bind(this));
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
        // shells are twice more quick than tanks
        if (this.shouldProcessTanks) {
            this.processTanks();
        }
        this.processShells();
        this.shouldProcessTanks = !this.shouldProcessTanks;
    },
    calculateGrid: function (calculateBy) {
        var i;
        var grid = new Array(this.props.globalSettings.map.height);
        var elms = (calculateBy === 'props')
            ? this.props.globalSettings.map.elements
            : this.state.elements;
        var totalElements = elms.tanks.concat(elms.walls, elms.shells, elms.explosions);

        for (i = 0; i < this.props.globalSettings.map.height; i++) {
            grid[i] = new Array(this.props.globalSettings.map.width).fill({ type: 'empty' });
        }
        totalElements.forEach(function (element) {
            grid[element.row][element.col] = element;
        });
        return grid;
    },
    processKeys: function (event) {
        var message = {
            type: 'key-pressed',
            data: {
                gameID: this.props.globalSettings.gameID,
                playerID: this.props.globalSettings.userID,
                keyCode: event.keyCode,
                currentElements: this.state.elements
            }
        };
        this.props.globalSettings.socket.send(JSON.stringify(message));
    },
    getInitialState: function () {
        return {
            grid: this.calculateGrid('props'),
            elements: this.props.globalSettings.map.elements
        }
    },
    componentWillReceiveProps: function (props) {
        this.state.elements = props.globalSettings.map.elements;
        this.setState(this.state);
    },
    componentWillMount: function () {
        document.addEventListener('keydown', this.processKeys);
    },
    componentDidMount: function () {
        setInterval(this.processInteractions, config.game.frequency);
    },
    componentWillUnmount: function () {
        document.removeEventListener('keydown', this.processKeys);
    },
    render: function () {
        return (
            <div className="box">
                <a href="/">Disconnect</a>
                { this.state.grid.map(function (row, index) {
                    return (
                        <Row elements={row} key={index} />
                    );
                }) }
            </div>
        );
    }
});

var Cell = React.createClass({
    render: function () {
        var style = {
            backgroundImage: '',
            backgroundPosition: ''
        };
        var sets = this.props.settings;
        if (sets.type === 'wall') {
            style.backgroundImage = 'url(img/bricks.png)';
        }
        if (sets.type === 'explosion') {
            style.backgroundImage = 'url(img/boom.png)';
            style.backgroundPosition = '-' + (sets.stage * 40) + 'px 0';
        }
        if (sets.type === 'tank') {
            style.backgroundImage = 'url(img/tank.png)';
            style.backgroundColor = sets.color;
            style.transform = 'rotate(' + sets.direction + 'deg)';
        }
        if (sets.type === 'shell') {
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

var ELEMENTS = [
    { x: 0, y: 0, type: 'wall' },
    { x: 0, y: 1, type: 'wall' },
    { x: 0, y: 2, type: 'wall' },
    { x: 1, y: 0, type: 'wall' },
    { x: 1, y: 1, type: 'wall' },
    { x: 1, y: 2, type: 'explosion', stage: 2 },
    { x: 2, y: 3, type: 'shell', color: 'red' },
    { x: 2, y: 5, type: 'shell', color: 'green' },
    { x: 2, y: 7, type: 'shell', color: 'blue' },
    { x: 2, y: 9, type: 'shell', color: 'yellow' },
    { x: 3, y: 3, type: 'tank', direction: 0, color: 'red' },
    { x: 3, y: 5, type: 'tank', direction: 90, color: 'green' },
    { x: 3, y: 7, type: 'tank', direction: 180, color: 'blue' },
    { x: 3, y: 9, type: 'tank', direction: 270, color: 'yellow' }
];

var isConnectionEstablished = false;
var width = 15;
var height = 17;

function processMessage (event) {
    var message = JSON.parse(event.data);

    console.log(message);
}

var Box = React.createClass({
    processMessage: processMessage,
    getDefaultProps: function () {
        var socket = new WebSocket('ws://localhost:1981');
        socket.onmessage = processMessage;
        return {
            socket: socket
        };
    },
    getInitialState: function () {
        var i;
        var grid = new Array(height);
        for (i = 0; i < height; i++) {
            grid[i] = new Array(width).fill({ type: 'empty' });
        }
        ELEMENTS.forEach(function (element) {
            grid[element.x][element.y] = element;
        });
        return {
            width: width,
            height: height,
            grid: grid
        }
    },
    render: function () {
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


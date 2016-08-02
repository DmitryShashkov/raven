var Cell = React.createClass({
    render: function () {
        return (
            <div className="cell">
                { this.props.type }
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
                            <Cell type={element.type} key={index} />
                        );
                    })
                }
            </div>
        );
    }
});

var ELEMENTS = [
    { x: 0, y: 0, type: 'terrain' },
    { x: 1, y: 1, type: 'explosion' },
    { x: 2, y: 2, type: 'shell' },
    { x: 3, y: 3, type: 'tank' },
];

var Box = React.createClass({
    getInitialState: function () {
        var width = 7;
        var height = 5;
        var i;
        var grid = new Array(height);
        for (i = 0; i < height; i++) {
            grid[i] = new Array(width).fill({ type: 'empty' });
        }
        ELEMENTS.forEach(function (element) {
            grid[element.x][element.y] = {
                type: element.type
            };
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


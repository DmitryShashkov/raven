function processMessage (received) {
    var message = JSON.parse(received.data);
    switch (message.type) {
        case 'initiate':
            this.state.userID = message.data.id;
            this.state.gamesList = message.data.gamesList;
            this.setState(this.state);
            break;
        case 'games-list-updated':
            this.state.gamesList = message.data.newGamesList;
            this.setState(this.state);
            break;
        case 'game-initiate':
            this.state.map = message.data.map;
            this.state.gameID = message.data.gameID;
            this.setState(this.state);
            window.location.href = '#/play';
            break;
        case 'personal-color-set':
            console.log('You are ' + message.data.color);
            break;
        case 'game-state-changed':
            // if (message.data.subType === 'direction') {
            //     _.findWhere(this.state.map.elements.tanks, {
            //         color: message.data.tankColor
            //     }).direction = message.data.newDirection;
            // }
            this.state.map.elements = message.data.newElements;
            this.setState(this.state);
            break;
    }
}
var App = React.createClass({
    getInitialState: function () {
        var state = {
            userName: chance.capitalize(chance.word()) + ', ' + chance.suffix(),
            route: window.location.hash.substr(1),
            socket: new WebSocket('wss://localhost:1981'),
            userID: '',
            gamesList: []
        };
        state.socket.onmessage = processMessage.bind(this);
        return state;
    },
    componentDidMount: function () {
        window.addEventListener('hashchange', (function () {
            this.setState({
                route: window.location.hash.substr(1)
            })
        }).bind(this))
    },
    render: function () {
        var Child;

        switch (this.state.route) {
            case '/games': Child = GamesList; break;
            case '/play': Child = GameBox; break;
            default: Child = MainScreen;
        }

        return (
            <div className='container'>
                <Child globalSettings={this.state} />
            </div>
        )
    }
});



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
    }
}
var App = React.createClass({
    getInitialState: function () {
        var state = {
            userName: chance.capitalize(chance.word()) + ', ' + chance.suffix(),
            route: window.location.hash.substr(1),
            socket: new WebSocket('ws://localhost:1981'),
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
            default: Child = MainScreen;
        }

        return (
            <div className='container'>
                <Child globalSettings={{
                    userName: this.state.userName,
                    userID: this.state.userID,
                    gamesList: this.state.gamesList,
                    socket: this.state.socket
                }} />
            </div>
        )
    }
});



var MainScreen = React.createClass({
    render: function () {
        var registeredID = this.props.globalSettings.userID;
        return (
            <div className="main-screen">
                <div>
                    Hi there, dear {this.props.globalSettings.userName}
                    </div>
                <div>
                    {
                        (registeredID)
                            ? 'You are registered with ID #' + registeredID
                            : 'Registering...'
                    }

                </div>
                <div>
                    <a href="#/games" disabled={!registeredID}>Find games</a>
                </div>
            </div>
        );
    }
});

var ListedGame = React.createClass({
    requestJoiningGame: function () {
        var message = {
            type: 'request-joining-game',
            data: {
                playerID: this.props.globalSettings.userID,
                playerName: this.props.globalSettings.userName,
                ownerID: this.props.owner.id
            }
        };
        this.props.globalSettings.socket.send(JSON.stringify(message));
    },
    render: function () {
        var ownedByMe = this.props.owner.id === this.props.globalSettings.userID;
        return (
            <div className="listed-game">
                <div>
                    Owner: {this.props.owner.name}
                    {(ownedByMe) ? '(you)' : ''}
                </div>
                <div>
                    { this.props.participants.length ? 'Participants: ' +
                    this.props.participants.map(function (el) { return el.name }).join('; ') : ''}
                </div>
                <button className={ (ownedByMe) ? '' : 'hidden' }>Start game</button>
                <button
                    className={ (ownedByMe) ? 'hidden' : '' }
                    onClick={this.requestJoiningGame}>
                    Join
                </button>
            </div>
        );
    }
});

var GamesList = React.createClass({
    requestGameCreation: function () {
        var message = {
            type: 'request-game-creation',
            data: {
                ownerID: this.props.globalSettings.userID,
                ownerName: this.props.globalSettings.userName
            }
        };
        this.props.globalSettings.socket.send(JSON.stringify(message));
    },
    getInitialState: function () {
        return {
            games: this.props.gamesList
        };
    },
    render: function () {
        var globalSettings = this.props.globalSettings;
        return (
            <div className="games-list">
                <div>
                    <a href="#/">Home</a>
                </div>
                <div>
                    <div><span>Games list</span></div>
                    {
                        this.props.globalSettings.gamesList.map(function (game, index) {
                            return (
                                <ListedGame
                                    key={index}
                                    owner={game.owner}
                                    participants={game.participants}
                                    globalSettings={globalSettings}
                                />
                            );
                        })
                    }
                </div>
                <button onClick={this.requestGameCreation}>Create</button>
            </div>
        );
    }
});

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



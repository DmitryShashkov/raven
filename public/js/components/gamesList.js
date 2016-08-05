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
        var ownerIDs = this.props.globalSettings.gamesList.map(function (game) {
            return game.owner.id
        });
        var amOwningGame = _.contains(ownerIDs, this.props.globalSettings.userID);
        var createButtonText = (!amOwningGame) ? 'Create' : 'Re-create';
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
                <button onClick={this.requestGameCreation}>{createButtonText}</button>
            </div>
        );
    }
});
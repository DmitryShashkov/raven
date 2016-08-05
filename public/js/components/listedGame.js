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
    requestLeavingGame: function () {
        var message = {
            type: 'request-leaving-game',
            data: {
                playerID: this.props.globalSettings.userID,
                ownerID: this.props.owner.id
            }
        };
        this.props.globalSettings.socket.send(JSON.stringify(message));
    },
    requestGameDisbanding: function () {
        var message = {
            type: 'request-game-disbanding',
            data: {
                ownerID: this.props.globalSettings.userID
            }
        };
        this.props.globalSettings.socket.send(JSON.stringify(message));
    },
    render: function () {
        var ownedByMe = this.props.owner.id === this.props.globalSettings.userID;
        var participantIDs = this.props.participants.map(function (el) {
            return el.id;
        });
        var amParticipating = _.contains(participantIDs, this.props.globalSettings.userID);
        return (
            <div className="listed-game">
                <div>
                    Owner: {this.props.owner.name}
                    {(ownedByMe) ? ' (you)' : ''}
                </div>
                <div>
                    { this.props.participants.length ? 'Participants: ' +
                    this.props.participants.map(function (el) { return el.name }).join('; ') : ''}
                </div>
                <button className={ (ownedByMe) ? '' : 'hidden' }>Start game</button>
                <button
                    className={ (ownedByMe) ? '' : 'hidden' }
                    onClick={ this.requestGameDisbanding }>
                    Disband
                </button>
                <button
                    className={ (ownedByMe || amParticipating) ? 'hidden' : '' }
                    onClick={ this.requestJoiningGame }>
                    Join
                </button>
                <button
                    className={ (amParticipating && !ownedByMe) ? '' : 'hidden' }
                    onClick={ this.requestLeavingGame }>
                    Leave
                </button>
            </div>
        );
    }
});
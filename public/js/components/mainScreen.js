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
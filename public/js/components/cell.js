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

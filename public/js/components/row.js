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

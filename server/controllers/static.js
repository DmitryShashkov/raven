var fs = require('fs');
var config = require('../../public/config');

module.exports = {
    index: (req, res, next) => {
        fs.createReadStream(__dirname + "./../../" + config.server.staticDir + "/index.html")
            .pipe(res);
    }
};

let fs = require('fs');
let config = require('../../config');

module.exports = {
    index: (req, res, next) => {
        fs.createReadStream(__dirname + "./../../" + config.server.staticDir + "/index.html")
            .pipe(res);
    }
};

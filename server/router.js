let router = require('express').Router();
let stat = require('./controllers/static');
let api = require('./controllers/api');

router.get('/', stat.index);

module.exports = router;
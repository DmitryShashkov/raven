var router = require('express').Router();
var stat = require('./controllers/static');
var api = require('./controllers/api');

router.get('/', stat.index);

module.exports = router;
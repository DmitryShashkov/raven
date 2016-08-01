let router = require('express').Router();
let stat = require('./controllers/static');

router.get('/', stat.index);

module.exports = router;
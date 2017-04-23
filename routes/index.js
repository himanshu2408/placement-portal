var express = require('express');
var router = express.Router();

/* GET index page. */
router.get('/', function(req, res, next) {

    res.render('index', {
        title: 'Index Page',
        pageID: 'index'
    });

});

module.exports = router;

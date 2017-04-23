var express = require('express');
var router = express.Router();

/* GET jobs page. */
router.get('/', function(req, res, next) {

    res.render('jobs', {
        title: 'Jobs Page',
        pageID: 'jobs'
    });

});

module.exports = router;

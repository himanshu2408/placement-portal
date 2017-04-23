var express = require('express');
var router = express.Router();

/* GET recruit page. */
router.get('/', function(req, res, next) {

    res.render('recruit', {
        pageTitle: 'Recruitment Page',
        pageID: 'recruit'
    });

});

module.exports = router;

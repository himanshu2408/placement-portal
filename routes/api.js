//dependencies
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

    res.render('api', {
        pageTitle: 'API Page',
        pageID: 'api'
    });

});

// student api
router.get('/student', function(req, res, next) {

    res.render('student', {
        pageTitle: 'Student Page',
        pageID: 'student'
    });

});

// company api
router.get('/company', function(req, res, next) {

    res.render('company', {
        pageTitle: 'Company Page',
        pageID: 'company'
    });

});

module.exports = router;
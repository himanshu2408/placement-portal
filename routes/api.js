//dependencies
var express = require('express');
var router = express.Router();
var Students = require('../models/student');
var Companies = require('../models/company');
var User = require('../models/user');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };

var uri = 'mongodb://nagarro:nagarro@ds115671.mlab.com:15671/placement_portal_nagarro';
mongoose.connect(uri, options);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
    console.log("Connected to the database.");
});

router.get('/', function(req, res, next) {
    res.render('api', {
        pageTitle: 'API Page',
        pageID: 'api',
        user: req.user
    });

});

// student apis
router.get('/student', function(req, res, next) {
    Students.find()
        .then(function (data) {
            res.json(data);
        });
});

// GET particular student
router.get('/student/:id', function(req, res, next) {
    Students.findById(req.params.id, function (err, student) {
        if(err){
            res.send(err);
        }
        else{
            res.json(student);
        }
    })
});

// update student profile
router.put('/student/:id', function(req, res, next) {
    var item = req.body;
    Students.findById(req.params.id, function (err, student) {
        if(err){
            res.send(err);
        }
        else{
            student.name = item.name;
            student.department = item.department;
            student.rollno = item.rollno;
            student.cgpa = item.cgpa;
            student.save();
            res.json(student);
        }
    })
});

// Add new student
router.post('/student', function(req, res, next) {
    var item = req.body;
    if(!item.name || !item.department || !item.rollno || !item.cgpa){
        res.status(400);
        res.json({
            "error": "BAD data"
        });
    }
    else{
        var student = new Students(item);
        student.save();
        res.send(student);
    }
});

// Delete a particular student
router.delete('/student/:id', function(req, res, next) {
    Students.findByIdAndRemove(req.params.id).exec();
    res.send("Student record has been deleted from the database.");
});



// company apis
router.get('/company', function(req, res, next) {
    Companies.find()
        .then(function (data) {
            res.json(data);
        });
});

// GET particular company
router.get('/company/:id', function(req, res, next) {
    Companies.findById(req.params.id, function (err, company) {
        if(err){
            res.send(err);
        }
        else{
            res.json(company);
        }
    })
});

// update company profile
router.put('/company/:id', function(req, res, next) {
    var item = req.body;
    Companies.findById(req.params.id, function (err, company) {
        if(err){
            res.send(err);
        }
        else{
            company.name = item.name;
            company.profile = item.profile;
            company.ctc = item.ctc;
            company.address = item.address;
            company.save();
            res.json(company);
        }
    })
});

// Add new company
router.post('/company', function(req, res, next) {
    var item = req.body;
    if(!item.name || !item.profile || !item.ctc || !item.address){
        res.status(400);
        res.json({
            "error": "BAD data"
        });
    }
    else{
        var company = new Companies(item);
        company.save();
        res.send(company);
    }
});

// Delete a particular company
router.delete('/company/:id', function(req, res, next) {
    Companies.findByIdAndRemove(req.params.id).exec();
    res.send("Company record has been deleted from the database.");
});




// Register student for a company
router.post('/company/:id', function(req, res, next) {
    var student = req.body;
    Companies.findById(req.params.id, function (err, company) {
        if(err){
            res.send(err);
        }
        else{
            company.registeredStudents.push(student);
            company.save();
            res.send(company);
        }
    })
});


// UnRegister student from company
router.delete('/company/:id/:s_id', function(req, res, next) {
    Companies.findById(req.params.id, function (err, company) {
        if(err){
            res.send(err);
        }
        else{
            company.registeredStudents.id(req.params.s_id).remove();
            company.save();
            res.send('Student has been unregistered successfully.');
        }
    })
});



// User Registration
router.post('/register', function (req, res, next) {
   var username = req.body.username;
   var password = req.body.password;
   var password2 = req.body.password2;

   //Validation
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if(errors){
        res.send(errors);
    }
    else{
        var newUser = new User({
            username: username,
            password: password
        });
        User.createUser(newUser, function (err, user) {
            if(err){
                res.send(err);
                throw err;
            }
            console.log(user);
            res.send('You are successfully registered with Username: '+username + ' and Password: '+password);
        });
    }
});



passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username, function(err, user){
            if(err) throw err;
            if(!user){
                return done(null, false, {message: 'Unknown User'});
            }

            User.comparePassword(password, user.password, function(err, isMatch){
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Invalid password'});
                }
            });
        });
    }));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});


router.post('/login',
    passport.authenticate('local', {successRedirect:'/api', failureRedirect:'/api/login',failureFlash: true}),
    function(req, res) {
        res.redirect('/api');
    });

router.get('/logout', function(req, res){
    req.logout();
    res.send('You are successfully logged out.');
});

router.get('/login', function (req, res, next) {
    if(!req.user){
        res.send('Please send a POST request with correct username and password to login.');
    }
    else{
        res.redirect('/api');
    }
});

module.exports = router;

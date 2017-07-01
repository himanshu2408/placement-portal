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


router.get('/', ensureAuthenticated, function(req, res, next) {
    if(!req.user){
        res.render('login');
    }
    else {
        res.render('api', {
            pageTitle: 'API Page',
            pageID: 'api',
            user: req.user
        });
    }

});

// STUDENT API'S

// List all students
router.get('/students', function(req, res, next) {
    Students.find()
        .then(function (data) {
            res.json(data);
        });
});

// GET particular student
router.get('/students/:id', function(req, res, next) {
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
router.put('/students/:id', function(req, res, next) {
    var item = req.body;
    var name = item.name;
    var department = item.department;
    var rollno = item.rollno;
    var cgpa = item.cgpa;
    req.checkBody('name', 'Student name is required').notEmpty();
    req.checkBody('department', 'Department is required').notEmpty();
    req.checkBody('rollno', 'RollNo is required').notEmpty();
    req.checkBody('rollno', 'RollNo should be an integer').isInt();
    req.checkBody('cgpa', 'CGPA is required').notEmpty();

    var errors = req.validationErrors();

    if(errors){
        res.send(errors);
    }
    else {
        Students.findById(req.params.id, function (err, student) {
            if (err) {
                res.send(err);
            }
            else {
                Students.getStudentByRollno(rollno, function (err, ifStudent) {
                    if(err){
                        res.send(err);
                    }
                    else if(ifStudent){
                        res.send('rollno already registered.');
                    }
                    else{
                        student.name = name;
                        student.department = department;
                        student.rollno = rollno;
                        student.cgpa = cgpa;
                        student.save();
                        res.json(student);
                    }
                });
            }
        })
    }
});

// Add new student
router.post('/students', function(req, res, next) {
    var item = req.body;
    var name = item.name;
    var department = item.department;
    var rollno = item.rollno;
    var cgpa = item.cgpa;
    req.checkBody('name', 'Student name is required').notEmpty();
    req.checkBody('department', 'Department is required').notEmpty();
    req.checkBody('rollno', 'RollNo is required').notEmpty();
    req.checkBody('rollno', 'RollNo should be an integer').isInt();
    req.checkBody('cgpa', 'CGPA is required').notEmpty();

    var errors = req.validationErrors();
    if(errors){
        res.send(errors);
    }
    else{
        Students.getStudentByRollno(rollno, function (err, ifStudent) {
            if(err){
                res.send(err);
            }
            else if(ifStudent){
                res.send('rollno already registered.');
            }
            else{
                var student = new Students(item);
                student.save();
                res.send(student);
            }
        });
    }
});

// Delete a particular student
router.delete('/students/:id', function(req, res, next) {
    Students.findByIdAndRemove(req.params.id).exec();
    res.send("Student record has been deleted from the database.");
});



// COMPANY API'S

//Get Companies List
router.get('/companies', function(req, res, next) {
    Companies.find()
        .then(function (data) {
            res.json(data);
        });
});

// get particular company
router.get('/companies/:id', function(req, res, next) {
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
router.put('/companies/:id', function(req, res, next) {
    var item = req.body;
    var name = item.name;
    var profile = item.profile;
    var ctc = item.ctc;
    var address = item.address;
    req.checkBody('name', 'Company Name is required').notEmpty();
    req.checkBody('profile', 'Profile is required').notEmpty();
    req.checkBody('ctc', 'CTC is required').notEmpty();
    req.checkBody('address', 'Company address is required').notEmpty();

    var errors = req.validationErrors();
    if(errors){
        res.send(errors);
    }
    else {
        Companies.findById(req.params.id, function (err, company) {
            if (err) {
                res.send(err);
            }
            else {
                Companies.getCompanyByName(name, function (err, ifCompany) {
                    if(err){
                        res.send(err);
                    }
                    else if(ifCompany){
                        res.send('Company with this name is already registered.');
                    }
                    else{
                        company.name = item.name;
                        company.profile = item.profile;
                        company.ctc = item.ctc;
                        company.address = item.address;
                        company.save();
                        res.json(company);
                    }
                });
            }
        })
    }
});

// Add new company
router.post('/companies', function(req, res, next) {
    var item = req.body;
    var name = item.name;
    var profile = item.profile;
    var ctc = item.ctc;
    var address = item.address;
    req.checkBody('name', 'Company Name is required').notEmpty();
    req.checkBody('profile', 'Profile is required').notEmpty();
    req.checkBody('ctc', 'CTC is required').notEmpty();
    req.checkBody('address', 'Company address is required').notEmpty();

    var errors = req.validationErrors();
    if(errors){
        res.send(errors);
    }
    else{
        Companies.getCompanyByName(name, function (err, ifname) {
           if(err){
               res.send(err);
           }
           else if(ifname){
               res.send('Company with this name is already registered.');
           }
           else{
               var company = new Companies({
                   name: name,
                   profile: profile,
                   ctc: ctc,
                   address: address
               });
               company.save();
               res.send(company);
           }
        });
    }
});

// Delete a particular company
router.delete('/companies/:id', function(req, res, next) {
    Companies.findByIdAndRemove(req.params.id).exec();
    res.send("Company record has been deleted from the database.");
});




// Register student for a company
router.post('/companies/:id', function(req, res, next) {
    var student = req.body;
    var name = student.name;
    var department = student.department;
    var rollno = student.rollno;
    var cgpa = student.cgpa;
    req.checkBody('name', 'Student Name is required').notEmpty();
    req.checkBody('department', 'Department is required').notEmpty();
    req.checkBody('rollno', 'RollNo is required').notEmpty();
    req.checkBody('rollno', 'RollNo should be an integer').isInt();
    req.checkBody('cgpa', 'CGPA is required').notEmpty();

    var errors = req.validationErrors();
    if(errors){
        res.send(errors);
    }
    else {
        Companies.findById(req.params.id, function (err, company) {
            if (err) {
                res.send(err);
            }
            else {
                var data = {
                    name: company.name,
                    rollno: rollno
                }
                company.registeredStudents.push(student);
                        company.save();
                        res.send(company);
/*
                Companies.ifStudentRegistered(data, function (err, ifRegistered) {
                    if(err){
                        res.send(err);
                    }
                    else if(ifRegistered){
                        res.send('Student with this rollno has already been registered.');
                    }
                    else{
                        company.registeredStudents.push(student);
                        company.save();
                        res.send(company);
                    }
                });
                */
            }
        })
    }
});


// UnRegister student from company
router.delete('/companies/:id/:s_id', function(req, res, next) {
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



// User Registration for this placement portal
router.post('/register', function (req, res, next) {
   var username = req.body.username;
   var password = req.body.password;
   var password2 = req.body.password2;

   //Validation
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password', '6 to 20 characters required').len(6, 20);
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
        User.getUserByUsername(username, function (err, ifuser) {
            if(err){
                res.send(err);
            }
            else if(ifuser){
                res.send('This user is already registered.');
            }
            else{
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
    }
});


// Dependencies for User registration
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
    passport.authenticate('local', {successRedirect:'/api'}),
    function(req, res) {
        res.redirect('/api');
    });

router.get('/logout', function(req, res){
    req.logout();
    res.send('You are successfully logged out.');
});

router.get('/login', function (req, res, next) {
    if(!req.user){
        res.render('login');
    }
    else{
        res.redirect('/api');
    }
});

router.get('/register', function (req, res, next) {
    if(!req.user){
        res.render('register');
    }
    else{
        res.redirect('/api');
    }
});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        //req.flash('error_msg','You are not logged in');
        res.redirect('/api/login');
    }
}

module.exports = router;

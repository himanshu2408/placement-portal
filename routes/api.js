//dependencies
var express = require('express');
var router = express.Router();
var mongojs = require('mongojs')
var db = mongojs('mongodb://nagarro:nagarro@ds115671.mlab.com:15671/placement_portal_nagarro', ['students', 'companies']);


router.get('/', function(req, res, next) {

    res.render('api', {
        pageTitle: 'API Page',
        pageID: 'api'
    });

});

// student apis
router.get('/student', function(req, res, next) {
    db.students.find(function (err, students) {
        if(err){
            res.send(err);
        }
        res.json(students);
    });
});

// GET particular student
router.get('/student/:id', function(req, res, next) {
    db.students.findOne({_id:mongojs.ObjectId(req.params.id)} ,function (err, student) {
        if(err){
            res.send(err);
        }
        res.json(student);
    });
});

// update student profile
router.put('/student/:id', function(req, res, next) {
    var student = req.body;
    var updStudent = {};
    if(student.name){
        updStudent.name = student.name;
    }
    if(student.department){
        updStudent.department = student.department;
    }
    if(student.rollno){
        updStudent.rollno = student.rollno;
    }
    if(student.cgpa){
        updStudent.cgpa = student.cgpa;
    }
    if(!updStudent){
        res.status(400);
        res.json({
            "error": "BAD data"
        });
    }
    else{
        db.students.update({_id:mongojs.ObjectId(req.params.id)}, updStudent, {} ,function (err, student) {
            if(err){
                res.send(err);
            }
            res.json(student);
        });
    }

});

// Add new student
router.post('/student', function(req, res, next) {
    var student = req.body;
    if(!student.name || !student.department || !student.rollno || !student.cgpa){
        res.status(400);
        res.json({
            "error": "BAD data"
        });
    }
    else{
        db.students.save(student, function (err, student) {
            if(err){
                res.send(err);
            }
            res.json(student);
        });
    }
});

// Delete a particular student
router.delete('/student/:id', function(req, res, next) {
    db.students.remove({_id:mongojs.ObjectId(req.params.id)} ,function (err, student) {
        if(err){
            res.send(err);
        }
        res.json(student);
    });
});



// company apis
router.get('/company', function(req, res, next) {
    db.companies.find(function (err, companies) {
        if(err){
            res.send(err);
        }
        res.json(companies);
    });
});

// GET particular company
router.get('/company/:id', function(req, res, next) {
    db.companies.findOne({_id:mongojs.ObjectId(req.params.id)} ,function (err, company) {
        if(err){
            res.send(err);
        }
        res.json(company);
    });
});

// update company profile
router.put('/company/:id', function(req, res, next) {
    var company = req.body;
    var updCompany = {};
    if(company.name){
        updCompany.name = company.name;
    }
    if(company.profile){
        updCompany.profile = company.profile;
    }
    if(company.ctc){
        updCompany.ctc = company.ctc;
    }
    if(company.address){
        updCompany.address = company.address;
    }
    if(!updCompany){
        res.status(400);
        res.json({
            "error": "BAD data"
        });
    }
    else{
        db.companies.update({_id:mongojs.ObjectId(req.params.id)}, updCompany, {} ,function (err, company) {
            if(err){
                res.send(err);
            }
            res.json(company);
        });
    }

});

// Add new company
router.post('/company', function(req, res, next) {
    var company = req.body;
    if(!company.name || !company.profile || !company.ctc || !company.address){
        res.status(400);
        res.json({
            "error": "BAD data"
        });
    }
    else{
        db.companies.save(company, function (err, company) {
            if(err){
                res.send(err);
            }
            res.json(company);
        });
    }
});

// Delete a particular company
router.delete('/company/:id', function(req, res, next) {
    db.companies.remove({_id:mongojs.ObjectId(req.params.id)} ,function (err, company) {
        if(err){
            res.send(err);
        }
        res.json(company);
    });
});




// Register student for a company
router.post('/company/:id/register', function(req, res, next) {
    var student = req.body;
    if(!student.name || !student.department || !student.rollno || !student.cgpa){
        res.status(400);
        res.json({
            "error": "BAD data"
        });
    }
    else{
        db.companies.findOne({_id:mongojs.ObjectId(req.params.id)} ,function (err, company) {
            if(err){
                res.send(err);
            }
            else{

            }
        });
        db.companies.save(company, function (err, company) {
            if(err){
                res.send(err);
            }
            res.json(company);
        });
    }
});


module.exports = router;
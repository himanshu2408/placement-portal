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

// student api
router.get('/student', function(req, res, next) {
    db.companies.find(function (err, companies) {
        if(err){
            res.send(err);
        }
        res.json(companies);
    });
});

// GET particular student
router.get('/student/:id', function(req, res, next) {
    db.students.findOne({_id:mongojs.objectId(req.params.id)} ,function (err, student) {
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
        db.students.update({_id:mongojs.objectId(req.params.id)}, updStudent, {} ,function (err, student) {
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
    db.students.remove({_id:mongojs.objectId(req.params.id)} ,function (err, student) {
        if(err){
            res.send(err);
        }
        res.json(student);
    });
});

// company api
router.get('/company', function(req, res, next) {
   db.students.find(function (err, students) {
       if(err){
           res.send(err);
       }
       res.json(students);
   });
});

module.exports = router;
var mongoose = require('mongoose');

var studentSchema = mongoose.Schema({

    name: {
        type: String
    },
    department: {
        type: String
    },
    rollno:{
        type: Number,
        unique: true
    },
    cgpa:{
        type: String
    }
},{
    timestamps: true
});

var Student = module.exports = mongoose.model('Student', studentSchema);

module.exports.getStudentByRollno = function (rollno, callback) {
    var query = {rollno: rollno};
    Student.findOne(query, callback);
}
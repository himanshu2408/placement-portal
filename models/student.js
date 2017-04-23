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
        type: Number
    }
},{
    timestamps: true
});

var Student = module.exports = mongoose.model('Student', studentSchema);
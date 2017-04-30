var mongoose = require('mongoose');


var registeredStudentSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    department:{
        type: String,
        required: true
    },
    rollno:{
        type: Number,
        required: true
    },
    cgpa:{
        type: Number,
        required: true
    }
},{
    timestamps:true
});

var companySchema = mongoose.Schema({

    name: {
        type: String,
        unique: true
    },
    profile: {
        type: String
    },
    ctc: {
        type: String
    },
    address: {
        type: String
    },
    registeredStudents: [registeredStudentSchema]
},{
    timestamps: true
});

var Company = module.exports = mongoose.model('Company', companySchema);

module.exports.getCompanyByName = function (name, callback) {
    var query = { name: name };
    Company.findOne(query, callback);
}

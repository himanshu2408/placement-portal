var mongoose = require('mongoose');

var companySchema = mongoose.Schema({

    name: {
        type: String
    },
    profile: {
        type: String
    },
    ctc: {
        type: String
    },
    address: {
        type: String
    }
},{
    timestamps: true
});

var Company = module.exports = mongoose.model('Company', companySchema);
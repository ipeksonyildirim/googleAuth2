const Joi = require('joi');
const mongoose = require('mongoose');

const StudentSchema  = new mongoose.Schema({
    StudentName: {
        FirstName: {
            type: String,
            required: true,
        },
        LastName: {
            type: String,
            required: true
        }
    },
    DateOfAdmission: {
        type: Date,
        required: true
    },
    Status: {
        type: String,
        default: 'aktif',
        enum: ['aktif', 'pasif', 'mezun'],
        required: true,
    },
    Email: {
        type: String,
        required: true
    },
    Address: [{
        AddrType: {
            type: String,
            required: true,
            trim: true,
    
        },
        City: {
            type: String,
            required: true
        },
        State: {
            type: String,
            required: true
        },
        PostalCode: {
            type: String,
            required: true
        },
        Country: {
            type: String,
            required: true
        }
    }],
    Contact: [{
    ContactType: {
        type: String,
        required: true,
        trim: true,

    },
    Value: {
        type: String,
        required: true,

    }
    }],
    Internship: [{
    Year: {
        type: Number,
        required: true,

    },
    Term: {
        type: String,
        required: true,

    },
    CompanyName: {
        type: String,
        required: true,

    },
    StartDate: {
        type: String,
        required: true,
        trim: true,

    },
    EndDate: {
        type: String,
        required: true,

    }
    }],
    Scholarship: {
        type: Number,
        required: true,
    },

    Class: {
        type: String,
        required: true,
        enum: ['1', '2', '3', '4']
    },
    EducationTerm: {
        type: Number,
        required: true,
        default: 1,
    },
    Gpa: {
        type: Number,
        required: true,
    },
    SecondForeignLanguage:{
        type: String,
        required: true,
    },
    Department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
    },
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    Advisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lecturer',
    },
    Credit: {
        type: Number,
        required: true,
        default: 1,
    },
    StudentId: {
        type: Number,
        required: true,
    }
});


/*
function validateStudent(student) {
    const schema = {
        FirstName: Joi.string().alphanum().regex(/[a-zA-Z]/).required().label(' First Name '),
        LastName: Joi.string().required(),
        Gender: Joi.string().required(),
        Status: Joi.string().required(),
        DateOfBirth: Joi.string().required(),
        DateOfAdmission: Joi.string().required(),
        Email: Joi.string().email().required(),
        Address: Joi.string().required(),
        AddrType: Joi.string().required(),
        City: Joi.string().required(),
        State: Joi.string().required(),
        PostalCode: Joi.number().required(),
        Country: Joi.string().required(),
        Internship: Joi.number().required(),
        Year: Joi.number().required(),
        Term: Joi.string().positive().required(),
        CompanyName: Joi.string().required(),
        StartDate: Joi.string().required(),
        EndDate: Joi.string().required(),
        Contact: Joi.string().required(),
        ContactType: Joi.string().required(),
        Value: Joi.string().required(),
        Scholarship: Joi.number().required(),
        BranchName: Joi.string().required(),
        Class: Joi.string().required(),
        EducationTerm: Joi.string().required(),
        Gpa: Joi.number().required(),
        secondForeignLanguage: Joi.string().required(),
        StudentId: Joi.number().required(),   
        credit:  Joi.number().required(),
        
        _method: Joi.string().empty('')
    };

    return Joi.validate(student, schema);
}
*/
module.exports = mongoose.model('Student', StudentSchema)
//exports.validate = validateStudent;



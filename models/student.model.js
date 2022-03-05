const mongoose = require('mongoose')
var Float = require('mongoose-float').loadType(mongoose);

const StudentSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'aktif',
        enum: ['aktif', 'pasif', 'mezun'],
        required: true,
    },
    
    scholarship: {
        type: Float,
        required: true,
    },

    educationTerm: {
        type: Number,
        required: true,
        default: 1,
    },
    gpa: {
        type: Float,
        required: true,
    },
    degree: {
        type: Number,
        required: true,
        default: 1,
    },
    secondForeignLanguage:{
        id: {
            type: Number,
            required: true,
        },
        value:{
            type: String,
            required: true,
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    advisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lecturer',
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
    },
    registerationDate: {
        type: Date,
        default: Date.now,
    },
    credit: {
        type: Number,
        required: true,
        default: 1,
    },

    adress: [adressSchema],
    contact: [contactSchema],
    internship: [internshipSchema],
})
const adressSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    addrType: {
        type: String,
        required: true,
        trim: true,

    },
    address: {
        type: String,
        required: true,
        trim: true,

    },
    city: {
        type: String,
        required: true,
        trim: true,

    },
    district: {
        type: String,
        required: true,
        trim: true,

    },
    postalCode: {
        type: String,
        required: true,

    },
 });

 const internshipSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,

    },
    term: {
        type: String,
        required: true,

    },
    companyName: {
        type: String,
        required: true,

    },
    startDate: {
        type: String,
        required: true,
        trim: true,

    },
    endDate: {
        type: String,
        required: true,

    },
    grade: {
        type: Boolean,
        required: true,

    },
 });

 const contactSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    contactType: {
        type: String,
        required: true,
        trim: true,

    },
    value: {
        type: String,
        required: true,

    },

 });



module.exports = mongoose.model('Student', StudentSchema)
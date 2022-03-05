const mongoose = require('mongoose')
var Float = require('mongoose-float').loadType(mongoose);

const GradeSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
    },
    lecturer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lecturer',
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    },
    grade: {
        type: String,
        required: true,

    },
    courseType: {
        type: String,
        required: true,

    },
    repeat:{
        type: Boolean,
        required: true,
    },
    termYear: {
        type: String,
        required: true,
    },
    termName: {
        type: String,
        required: true,
    },

});

module.exports = mongoose.model('Grade', GradeSchema);
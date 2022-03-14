const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
    shortCode: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    credit: {
        type: Number,
        required: true,
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
    },
    termYear: {
        type: String,
        required: true,
    },
    termName: {
        type: String,
        required: true,day
    },
    lessonHours:[{
        day:  {
            type: String,
            required: true,
        },
        startedHours: {
            type: Number,
            required: true,
        },
        finishedHours: {
            type: Number,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        zoomId: {
            type: String,
            required: true,
        },
        
    }],
    

    
});
module.exports = mongoose.model('Course', CourseSchema);
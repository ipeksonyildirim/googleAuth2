const mongoose = require('mongoose')
var Float = require('mongoose-float').loadType(mongoose);

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
    lecturer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lecturer',
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
        required: true,
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
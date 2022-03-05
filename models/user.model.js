const mongoose = require('mongoose');
const {Schema, Model} = mongoose

const UserSchema = new Schema({
    name: String,
    email: {type: String, unique: true},
    image: {type: String},
    createdAt: {type: Date, default: Date.now()},
    courses: [{
        type: Schema.Types.ObjectId,
        ref: 'Course'
    }],
    gpa: Number,
    addresses: [{String}],
    role: {
        type: String,
        enum: ['student', 'academic'],
        default: ['student']
    },
    appointments: [{
        date: Date,
        from: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    faculty: String,
    major: String,
    token: String,
    active: Boolean
})

module.exports = new Model('User', UserSchema)
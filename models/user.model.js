const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new mongoose.Schema({
    googleId: {
        type:String,
        required: true
    },
    displayName: {
        type:String,
        required: true
    },
    firstName: {
        type:String,
        required: true
    },
    lastName: {
        type:String,
        required: true
    },
    image: {
        type:String
    },
    createdAt: {
        type:Date,
        default: Date.now()
    }

})

UserSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', UserSchema)
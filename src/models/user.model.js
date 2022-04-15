const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  googleId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() },
  isAdmin: Boolean,
  request: Boolean,
  privileges: {
    read: Boolean, create: Boolean, update: Boolean, delete: Boolean,
  },
  availableDates:[{ 
    date:{type: Date},
    hours: String,

  }
  ],
  appointments: [{
    with: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date },
    hours: String,
    isActive: Boolean,
  }],
  contact: [{ name: String, value: String }],
  
  address: [{
    addrType: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  }],
  role: { type: String, enum: ['ogrenci', 'lecturer', 'personnel']},
  isLecturer: { type: Boolean,default:false, required: true },
  isPersonnel: { type: Boolean,default:false, required: true },
  isStudent: { type: Boolean,default:false,required: true },
  isRegistered: { type: Boolean,default:false, required: true },
});

module.exports = mongoose.model('User', UserSchema);

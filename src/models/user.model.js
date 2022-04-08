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

  }
  ],
  appointments: [{
    with: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
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
});

module.exports = mongoose.model('User', UserSchema);

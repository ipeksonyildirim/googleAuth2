const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
  },
  name: String,
  email: String,
  // TODO first name last name has been removed, check controllers
  image: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },

  isAdmin: Boolean,
  request: Boolean,
  privileges: {
    read: Boolean,
    create: Boolean,
    update: Boolean,
    delete: Boolean,
  },

  appointments: [{
    with: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: Date,
    isActive: Boolean,
  }],

  address: [{
    type: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  }],

  contact: [{
    type: String,
    value: String,
  }],
});

module.exports = mongoose.model('User', UserSchema);

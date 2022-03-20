const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  // TODO first name last name has been removed, check controllers
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  request: {
    type: Boolean,
    default: false,
  },
  privileges: {
    read: {
      type: Boolean,
      default: false,
    },
    create: {
      type: Boolean,
      default: false,
    },
    update: {
      type: Boolean,
      default: false,
    },
    delete: {
      type: Boolean,
      default: false,
    },
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
  Address: [{
    AddrType: {
      type: String,
      required: true,
      trim: true,

    },
    City: {
      type: String,
      required: true,
    },
    State: {
      type: String,
      required: true,
    },
    PostalCode: {
      type: String,
      required: true,
    },
    Country: {
      type: String,
      required: true,
    },
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

    },
  }],
});

module.exports = mongoose.model('User', UserSchema);

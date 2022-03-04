const mongoose = require("mongoose");
var Float = require("mongoose-float").loadType(mongoose);

const AdminDeptSchema = new mongoose.Schema({
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
    default: "aktif",
    enum: ["aktif", "pasif"],
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  registerationDate: {
    type: Date,
    default: Date.now,
  },
  adress: [adressSchema],
  contact: [contactSchema],
});

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
  
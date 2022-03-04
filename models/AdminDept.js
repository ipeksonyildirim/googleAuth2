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
  },

  personel: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Personel",
    },
  ],

  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AppointmentDepartment",
  },
});

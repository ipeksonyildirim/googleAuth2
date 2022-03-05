const mongoose = require("mongoose");
var Float = require("mongoose-float").loadType(mongoose);

const AppointmentDepartment = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
  },
  appointment: {
    type: Date,
    required: true,
  },

});

module.exports = mongoose.model('AppointmentDepartment', AppointmentDepartmentSchema);
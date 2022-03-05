const mongoose = require("mongoose");
var Float = require("mongoose-float").loadType(mongoose);

const AppointmentAdvisor = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  advisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lecturer",
  },
  appointment: {
    type: Date,
    required: true,
  },

});

module.exports = mongoose.model('AppointmentAdvisor', AppointmentAdvisorSchema);
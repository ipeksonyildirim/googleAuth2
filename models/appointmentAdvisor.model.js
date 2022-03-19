const mongoose = require('mongoose');

const AppointmentAdvisorSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
  },
  advisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lecturer',
  },
  appointment: {
    type: Date,
    required: true,
  },

});

module.exports = mongoose.model('AppointmentAdvisor', AppointmentAdvisorSchema);

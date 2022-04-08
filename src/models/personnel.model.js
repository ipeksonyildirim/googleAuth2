const mongoose = require('mongoose');

const PersonnelSchema = new mongoose.Schema({
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Personnel', PersonnelSchema);

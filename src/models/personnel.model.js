const mongoose = require('mongoose');

const PersonnelSchema = new mongoose.Schema({
  Department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  User: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Personnel', PersonnelSchema);

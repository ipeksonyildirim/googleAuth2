const mongoose = require("mongoose");
var Float = require("mongoose-float").loadType(mongoose);

const DepartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  curriculum:{
    type: String,
    required: false,
  },
});
module.exports = mongoose.model('Department', DepartmentSchema);
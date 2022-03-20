const Department = require('../models/department.model');

const findByName = async (name) => {
  let result;
  try {
    result = await Department.findOne({ name });
  } catch (err) {
    result = err;
  }
  return result;
};

const findAll = async () => {
  let result;
  try {
    result = await Department.find();
  } catch (err) {
    result = err;
  }
  return result;
};

module.exports = { findByName, findAll};

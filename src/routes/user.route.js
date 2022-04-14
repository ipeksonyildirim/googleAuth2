const express = require('express')
const router = express.Router()
const User = require('../models/user.model')

router.get("/", async (req, res, next) => {
  const name = req.query.name;
  let result;
  try {
    result = await User.find({ "name": { "$regex": name, "$options": "i" } });
  } catch (err) {
    res.status(500).json({
      message: err.message
    })
  }
  if (result.length === 0) {
    res.status(404).json({
      message: "User not found"
    })
  } else {
    const users = [];
    result.forEach(user => {
      // if user.name.includes ignore case
      if (user.name.toLowerCase().includes(name.toLowerCase())) {
        const userObj = {
          _id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
        }
        users.push(userObj);
      }
    }
    )
    res.status(200).json({
      users
    })
  }
})

module.exports = router;
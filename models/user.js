const mongoose = require('mongoose')

const User = mongoose.model('User', {
  userName: String,
  name: String,
  adult: Boolean,
  passwordHash: String

})

module.exports = User
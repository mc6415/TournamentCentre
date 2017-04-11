const mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('User', {
  username: {type: String, required: true, unique: true},
  salt: {type: String, required: true},
  pepper: {type: String, required: true},
  battleTag: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  isAdmin: {type: Number, default: 0}
})

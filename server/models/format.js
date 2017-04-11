const mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Format', {
  name: {type: String, required: true},
  teamSize: {type: Number, default: 6}
})

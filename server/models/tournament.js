const mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Tournament', {
  title: {type: String, required: true},
  format: {type: Schema.Types.ObjectId, ref: 'Formats'},
  signedUp: [{tpye:Schema.Types.ObjectId, ref: 'Competitor'}]
})

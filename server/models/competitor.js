const mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Competitor', {
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  tournament: {type: Schema.Types.ObjectId, ref: 'Tournament'}
})

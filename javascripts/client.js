var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var Location = new Schema({
  created_on  : {type: Date, default: Date.now},
    latitude    : Number,
    longitude   : Number
});
exports.Location = Location;

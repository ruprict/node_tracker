var Location, Schema, mongoose;
mongoose = require('mongoose');
Schema = mongoose.Schema;
Location = new Schema({
  created_on: {
    type: Date,
    "default": Date.now
  },
  latitude: Number,
  longitude: Number
});
exports.Location = Location;
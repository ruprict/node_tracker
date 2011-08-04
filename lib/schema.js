var LocationSchema, Schema, User, UserSchema, everyauth, mongoose, mongooseAuth;
everyauth = require('everyauth');
mongoose = require('mongoose');
mongooseAuth = require('mongoose-auth');
Schema = mongoose.Schema;
LocationSchema = new Schema({
  created_on: {
    type: Date,
    "default": Date.now
  },
  latitude: Number,
  longitude: Number
});
UserSchema = new mongoose.Schema({
  locations: [LocationSchema]
});
User = null;
UserSchema.method("addLocation", function(loc) {
  var lastLocation, num;
  console.log("** User.addLocation");
  console.dir(this);
  num = this.locations.length;
  lastLocation = this.locations[num - 1];
  console.log("** num = " + num);
  if (num === 0) {
    console.log("adding location");
    this.locations.push(loc);
    return true;
  }
  if (lastLocation.latitude === loc.latitude && lastLocation.longitude === loc.longitude && loc.created_on - lastLocation.created_on < 3600000) {
    log("*** returning false");
    return false;
  }
  this.locations.push(loc);
  return true;
});
exports.UserSchema = UserSchema;
exports.LocationSchema = LocationSchema;
everyauth = require 'everyauth'
mongoose = require 'mongoose'
mongooseAuth = require 'mongoose-auth'
Schema = mongoose.Schema
LocationSchema = new Schema
  created_on  : 
    type: Date
    default: Date.now
  latitude    : Number
  longitude   : Number

UserSchema = new mongoose.Schema
  locations: [LocationSchema]
User = null

UserSchema.method "addLocation", (loc) ->
  console.log "** User.addLocation"
  console.dir this
  num = @locations.length
  lastLocation = @locations[num-1]
  console.log "** num = " + num
  if num == 0
    console.log "adding location"
    @locations.push(loc)
    return true
  

  # If it's the same location and we are within the hour, don't add it
  # FOr some reason, the types are not the same, so can't use === (should figgur dis out) 
  if lastLocation.latitude == loc.latitude and lastLocation.longitude == loc.longitude and loc.created_on - lastLocation.created_on < 3600000
    log "*** returning false"
    return false
  
  @locations.push(loc)
  return true

exports.UserSchema = UserSchema
exports.LocationSchema = LocationSchema

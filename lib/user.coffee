everyauth = require 'everyauth'
mongoose = require 'mongoose'
mongooseAuth = require 'mongoose-auth'
require "date-utils"

Schema = mongoose.Schema
LocationSchema = new Schema
  created_on  : 
    type: Date
    default: Date.now
    require: true
  latitude    : 
    type: Number
    reqiured: true
  longitude: 
    type: Number
    reqiured: true

UserSchema = new mongoose.Schema
  locations: [LocationSchema]
User = null

UserSchema.method "addLocation", (loc) ->
  num = @locations.length
  lastLocation = @locations[num-1]
  if num == 0
    @locations.push(loc)
    return true

  # If it's the same location and we are within the hour, don't add it
  # FOr some reason, the types are not the same, so I have to convert the types (should figgur dis out) 
  if Number(lastLocation.latitude) == Number(loc.latitude) and Number(lastLocation.longitude) == Number(loc.longitude) and lastLocation.created_on.getMinutesBetween(loc.created_on) < 10
    return false
  @locations.push(loc)
  return true
UserSchema.plugin mongooseAuth,
  everymodule:
    everyauth:
      User: ->
        return User
  password:
    loginWith:
      "email"
    extraParams:
      name:
        first: String
        last: String
    everyauth:
      getLoginPath: '/login'
      postLoginPath: '/login'
      loginView: 'partials/login.jade'
      loginLocals:
        title: "Login"
      getRegisterPath: '/register'
      postRegisterPath: '/register'
      registerView: 'register.jade'
      registerLocals:
        title: "Register"
      loginSuccessRedirect: '/'
      registerSuccessRedirect: '/'

validateEmail = (v) ->
  sys.puts('arse')
  return /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/.test(v)

UserSchema.path('email').validators.push([validateEmail, "Invalid Email"])
mongoose.model 'User', UserSchema
User = mongoose.model 'User'

exports.User = User

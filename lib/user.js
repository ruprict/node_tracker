var LocationSchema, Schema, User, UserSchema, everyauth, mongoose, mongooseAuth, validateEmail;
everyauth = require('everyauth');
mongoose = require('mongoose');
mongooseAuth = require('mongoose-auth');
require("date-utils");
Schema = mongoose.Schema;
LocationSchema = new Schema({
  created_on: {
    type: Date,
    "default": Date.now,
    require: true
  },
  latitude: {
    type: Number,
    reqiured: true
  },
  longitude: {
    type: Number,
    reqiured: true
  }
});
UserSchema = new mongoose.Schema({
  locations: [LocationSchema]
});
User = null;
UserSchema.method("addLocation", function(loc) {
  var lastLocation, num;
  num = this.locations.length;
  lastLocation = this.locations[num - 1];
  if (num === 0) {
    this.locations.push(loc);
    return true;
  }
  if (Number(lastLocation.latitude) === Number(loc.latitude) && Number(lastLocation.longitude) === Number(loc.longitude) && lastLocation.created_on.getMinutesBetween(loc.created_on) < 10) {
    return false;
  }
  this.locations.push(loc);
  return true;
});
UserSchema.plugin(mongooseAuth, {
  everymodule: {
    everyauth: {
      User: function() {
        return User;
      }
    }
  },
  password: {
    loginWith: "email",
    extraParams: {
      name: {
        first: String,
        last: String
      }
    },
    everyauth: {
      getLoginPath: '/login',
      postLoginPath: '/login',
      loginView: 'partials/login.jade',
      loginLocals: {
        title: "Login"
      },
      getRegisterPath: '/register',
      postRegisterPath: '/register',
      registerView: 'register.jade',
      registerLocals: {
        title: "Register"
      },
      loginSuccessRedirect: '/',
      registerSuccessRedirect: '/'
    }
  }
});
validateEmail = function(v) {
  sys.puts('arse');
  return /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/.test(v);
};
UserSchema.path('email').validators.push([validateEmail, "Invalid Email"]);
mongoose.model('User', UserSchema);
User = mongoose.model('User');
exports.User = User;
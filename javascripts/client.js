var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var Location = new Schema({
  created_on  : {type: Date, default: Date.now},
    latitude    : Number,
    longitude   : Number
});

var Client = new Schema ({
    name        : String,
    locations   : [Location]
});

//public API
Client.prototype = {
  sentClients: false,
  update: function(message, callback){
    for (var prop in message) {
      console.log("** updating prop " + prop);
      if (prop === "id") continue;
      this[prop] = message[prop];
    }
    if (callback) callback(this);
  },
  setPosition: function(lat,lon) {
    this.latitude = lat;
    this.longitude = lon;
  },
  getId: function() {
    return this._id;        
  },
  toJson: function() {
    var str = this;
    str.id=this._id;
    
    return JSON.stringify(str);
  }
};

exports.Client = Client;
exports.Location = Location;

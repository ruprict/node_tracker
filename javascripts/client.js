
var Client = function(id,props){
    this._id = id;
    this.latitude = null;
    this.longitude = null;
    this.update(props);

};

//public API
Client.prototype = {
  sentClients: false,
  update: function(message){
    for (var prop in message) {
      console.log("** updating prop " + prop);
      if (prop === "id") continue;
      this[prop] = message[prop];
    }
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

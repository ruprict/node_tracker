var _u = require('underscore');

 var ClientManager = (function() {
  var _clients=[],
      _getClient = function(id) {
        return _u.detect(_clients, function(cli){
          if (cli.id === id) return cli;
        });
      };
  return {
    getClientById: function(id) {
      return _getClient(id);
    }, 
    getClients: function() {
      return _clients;            
    },
    addClient: function(cli) {
      if(_clients.length>0) console.log("first id = "+  _clients[0].id);
      if (!_getClient(cli.id)) {
        console.log("*** adding Client " + cli.id);
        console.dir(cli);
        _clients.push(cli);
        return;
      }
      //console.log("****CLIENT ALREADY ADDED");
    },
    removeClientById: function(id) {
      var cli = _getClient(id);
      if (cli) {
        _clients = _u.reject(_clients, function(c) {
          return c.id === id;
        });
      }
      return cli;
    }
  };

}());
module.exports = ClientManager;

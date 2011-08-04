var _u = require('underscore');

 var ClientManager = (function() {
  var _clients=[],
      _getClient = function(id) {
        return _u.detect(_clients, function(cli){
          if (cli.id === id) return cli;
        });
      },
      _getClientByCId = function(c_id) {
        return _u.detect(_clients, function(cli){
            console.log(c_id);
            console.log(cli.c_id);
            if (cli.c_id === c_id) return cli;
          });
      };
  return {
    getClientById: function(id) {
      return _getClient(id);
    },
    getClientByCId: function(c_id) {
      return _getClientByCId(c_id);
    },
    getClients: function() {
      return _clients;            
    },
    addClient: function(cli) {
      var exists = (cli.id) ? _getClient(cli.id) : _getClientByCId(cli.cid);
      if (!exists) {
        console.log("*** adding Client " );
        console.dir(cli);
        _clients.push(cli);
        return;
      }
    },
    removeClientById: function(id) {
      var cli = _getClient(id);
      if (cli) {
        _clients = _u.reject(_clients, function(c) {
          return c.id === id;
        });
      }
      return cli;
    },
    removeClientByCId: function(id) {
      var cli = this.getClientByCId(id);
      if (cli) {
        _clients = _u.reject(_clients, function(c) {
          return c.c_id === id;
        });
      }
      return cli;
    }

  };

}());
module.exports = ClientManager;

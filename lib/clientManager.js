var ClientManager, _u;
_u = require('underscore');
ClientManager = (function() {
  ClientManager.get = function() {
    var _ref;
    return (_ref = this.instance) != null ? _ref : this.instance = new this;
  };
  function ClientManager() {
    this.clients = [];
  }
  ClientManager.prototype.getClientById = function(id) {
    return _u.detect(this.clients, function(cli) {
      if (cli.id === id) {
        return cli;
      }
    });
  };
  ClientManager.prototype.getClientByCId = function(c_id) {
    return _u.detect(this.clients, function(cli) {
      if (cli.c_id === c_id) {
        return cli;
      }
    });
  };
  ClientManager.prototype.getClients = function() {
    return this.clients;
  };
  ClientManager.prototype.addClient = function(cli) {
    var exists;
    exists = cli.c_id != null ? this.getClientByCId(cli.c_id) : this.getClientById(cli.id);
    if (!exists) {
      return this.clients.push(cli);
    }
  };
  ClientManager.prototype.removeClientById = function(id) {
    var cli;
    cli = this.getClientById(id);
    if (cli != null) {
      return this.removeClient(cli);
    }
  };
  ClientManager.prototype.removeClientByCId = function(c_id) {
    var cli;
    cli = this.getClientByCId(c_id);
    if (cli != null) {
      return this.removeClient(cli);
    }
  };
  ClientManager.prototype.removeClient = function(cli) {
    this.clients = _u.reject(this.clients, function(c) {
      return (c.id === cli.id) || (c.c_id === cli.c_id);
    });
    return cli;
  };
  return ClientManager;
})();
exports.ClientManager = ClientManager;
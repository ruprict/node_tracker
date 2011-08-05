_u = require 'underscore'

class ClientManager
  @get: -> @instance ?= new @

  constructor: -> @clients = []

  getClientById: (id) ->
    _u.detect @clients, (cli) ->
      if cli.id == id
        cli;

  getClientByCId: (c_id) ->
    _u.detect @clients, (cli) ->
      return cli if cli.c_id == c_id

  getClients: ->
    @clients

  addClient: (cli) ->
    exists = if cli.c_id? then @.getClientByCId(cli.c_id) else @.getClientById(cli.id)
    if not exists
      @clients.push cli

  removeClientById: (id) ->
    cli = @.getClientById(id)
    @.removeClient cli if cli?

  removeClientByCId: (c_id) ->
    cli = @.getClientByCId(c_id)
    @.removeClient cli if cli?
   

  removeClient: (cli) ->
    @clients = _u.reject @clients, (c) ->
      (c.id == cli.id) || (c.c_id == cli.c_id)
    cli

exports.ClientManager = ClientManager

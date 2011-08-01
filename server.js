var sys = require('sys'),
    static = require('node-static'),
    crypto = require('crypto'),
    express = require('express'),
    io = require('socket.io'),
    json = JSON.stringify,
    log = sys.puts,
    clientManager = require('./javascripts/clientManager'),
    clientModel = require('./javascripts/client'),
    connect = require('connect'),
    _u = require('underscore'),
    clientFiles = new static.Server(),
    server;


function basic_auth(req,res, next) {
  if (req.headers.authorization && req.headers.authorization.search('Basic ') === 0){
    //fetch login and password
    if (new Buffer(req.headers.authorization.split(' ')[1], 'base64').toString() === 'horse:eatsP00') {
      next();
      log(req.session);
      return;
    }
  }
  console.log("Unable to authenticate user");
  console.log(req.headers.authorization);
  res.header('WWW-Authenticate', 'Basic realm="Node Tracker"');
  res.send("Authentication required", 401);
}


server = express.createServer(
    connect.logger(),
    //basic_auth,
    express.cookieParser(),
    express.session({secret:"horseFart"}),
  connect.static(__dirname)
);

server.get('/clients', function(req,res){
  var json = {clients: []}; 
  _u.each(clientManager.getClients(), function(cli) {
    json.clients.push(JSON.parse(cli.toJson()));
  });
  res.send(json);
});


server.listen(process.env.PORT || 8000);
ws = io.listen(server);

ws.sockets.on('connection', function(client){
  var c_id = client.id,
      currClient = new clientModel.Client(c_id);
  clientManager.addClient(currClient, function(err, cli) {
    log('** Client added');  
  });
  client.on('message', function(message) {
    if (!currClient.sentClients){
      sendExistingClients(client, function(cli) {
          currClient.sentClients = true;
      });
    }
    log ("* message from " + c_id);
    log("* message = " + message);
    var request = JSON.parse(message.replace('<', '&lt;').replace('>', '&gt;'));
    currClient.update(request, function(){
      doSend(client, currClient.toJson(), true);
    });
  });
  client.on('disconnect', function(){
    console.log("disconnecting");
    clientManager.removeClientById(c_id);
    var nick = JSON.parse(currClient.toJson())['nickname'];
    log("client " + nick + " disconnected");
    doSend(client,json({'id': c_id, 'action': 'close', 'nickname': nick}), true);

  });

});
function sendExistingClients(client, callback) {
 console.log("New client, sending clients");
  var clis = clientManager.getClients();
  cli = 0;
  console.log("*** Current number of clients connected is " + clis.length);
  _u.each(clis, function(oldCli){
    if (oldCli.getId() !== client.id) {
      log('Sending ' + oldCli.getId());
      console.dir(oldCli);
      doSend(client,oldCli.toJson(), false);
    } else log('same id **');
  });
  callback(client);
};

function doSend(client, message, broadcast){
  try {
    if (broadcast) {
      client.broadcast.send(message);
    } else {
      client.send(message);
    }
  } catch (e) {
    console.log("*** ERROR ***");
    console.dir(e);
  }

}

var sys = require('sys'),
    static = require('node-static'),
    crypto = require('crypto'),
    express = require('express'),
    io = require('socket.io'),
    auth = require('connect-auth'),
    json = JSON.stringify,
    log = sys.puts,
    connect = require('connect'),
    clientFiles = new static.Server(),
    server, socket,
    con = console,
    clients={};


function basic_auth(req,res, next) {
  if (req.headers.authorization && req.headers.authorization.search('Basic ') === 0){
    //fetch login and password
    if (new Buffer(req.headers.authorization.split(' ')[1], 'base64').toString() === 'horse:eatsP00') {
      next();
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
    basic_auth,
  connect.static(__dirname)
);

server.listen(process.env.PORT || 8000);
socket = io.listen(server);

socket.sockets.on('connection', function(client){
  con.log("Connection made...");
  client.on('message', function(message) {

    con.log("message recieved: " + JSON.stringify(message));
    try {
      request = JSON.parse(message.replace('<', '&lt;').replace('>', '&gt;'));
    } catch (SyntaxError) {
      log('Invalid JSON');
      log(message);
      return false;
    }

    /*if (request.action != 'close' && request.action != 'move' && request.action != 'speak') {
      log('Invalid request: ' + message);
      return false;
    }*/
  if (clients[client.id] === undefined){  
  //Send existing clients
    for (var sess in clients){
      log('sess = ' + sess);
      if (sess === client.id) continue;
      console.dir(clients[sess]);
      log('Sending ' + clients[sess]["nickname"]);
      client.send(clients[sess]);
    }
  }
    request.id = client.id;
    clients[client.id] = json(request);
    client.broadcast.send(json(request));

  });
  client.on('disconnect', function(){
    if (clients[client.id] === undefined) return;
    var nick = JSON.parse(clients[client.id])['nickname'];
    console.dir(clients[client.id]);
    log("client " + nick + " disconnected");
    client.broadcast.emit('message',json({'id': client.id, 'action': 'close', 'nickname': nick}));
    delete clients[client.id];
  });
  

});


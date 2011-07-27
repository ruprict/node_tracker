var sys = require('sys'),
    static = require('node-static'),
    http = require('http'),
    crypto = require('crypto'),
    io = require('socket.io'),
    json = JSON.stringify,
    log = sys.puts,
    clientFiles = new static.Server(),
    server, socket,
    con = console,
    clients={};


server = http.createServer(function(request, response){
  request.addListener('end', function(){
    clientFiles.serve(request, response);
  });
});

server.listen(8000);
socket = io.listen(server);

socket.sockets.on('connection', function(client){
  con.log("Connection made...");
  log('log');
  console.dir(clients);
  client.on('message', function(message) {

    con.log("message recieved: " + JSON.stringify(message));
   // try {
      request = JSON.parse(message.replace('<', '&lt;').replace('>', '&gt;'));
    //} catch (SyntaxError) {
      log('Invalid JSON');
      log(message);
     // return false;
    //}

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
    delete clients[client.id];
    client.broadcast.emit('message',json({'id': client.id, 'action': 'close'}));
  });
  

});


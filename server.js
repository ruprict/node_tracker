var mongoose = require("mongoose"),
    mongooseAuth = require('mongoose-auth'),
    everyauth = require('everyauth'),
    io = require('socket.io'),
    ClientManager = require('./lib/clientManager').ClientManager,
    clientManager = ClientManager.get(),
    connect = require('connect'),
    _u = require('underscore'),
    express = require('express'),
    server, 
    User = require('./lib/user').User;

mongoose.connect('mongodb://localhost/node_tracker_test'),

server = express.createServer(
    connect.logger(),
    express.compiler({src:__dirname+"/public", dest:__dirname + "/public", enable: ['coffeescript']}),
    express.cookieParser(),
    express.bodyParser(),
    express.session({secret:"horseFart"}),
    express.static(__dirname + "/public"),
    mongooseAuth.middleware()
);
server.set('view engine', 'jade');
server.get('/', function(req, res) {
  res.render('index', { title: "Tracker"});
});

server.get('/clients', function(req,res){
  var json = {clients: []}; 
  _u.each(clientManager.getClients(), function(cli) {
    json.clients.push(JSON.parse(cli.toJson()));
  });
  res.send(json);
});

server.get('/crumbs', function(req, res) {

  res.send(req.user.locations);

});

server.listen(process.env.C9_PORT || process.env.PORT || 8000);
ws = io.listen(server);
function parse_cookies(_cookies) {
  var cookies = {};    
  _cookies && _cookies.split(';').forEach(function( cookie ) {
      var parts = cookie.split('=');
      cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
  });    
  return cookies;
}
/// This isn't doing anything, but it could...
ws.configure(function () {
  function auth (data, fn) {
    var cookies = parse_cookies(data.headers.cookie);
    fn(null, true);
  };  
  ws.set('authorization', auth);
});

ws.sockets.on('connection', function(client){
  sendExistingClients(client);
  clientManager.addClient({c_id: client.id});
  console.log("*** number of connected clients = " + clientManager.getClients().length);
  client.on('message', function(message) {
    log("* message = " + message);
    var request = JSON.parse(message.replace('<', '&lt;').replace('>', '&gt;'));
    var currClient = clientManager.getClientByCId(client.id);
    currClient.id = request.id;
    currClient.latitude = request.latitude;
    currClient.longitude = request.longitude;
    currClient.nickname = request.nickname;
    if (!request.latitude || !request.longitude || !request.nickname || !request.id) return;
    User.findById(request.id, function(err, user) {
      console.log("*** found user");
      if (user.addLocation({ latitude: request.latitude, longitude: request.longitude, created_on: new Date()})) {
        user.save(function(err, user) {
          if (err) console.dir(err);
          else console.log('location added');
        } );
      }
      currClient.action = "position";
      console.log(JSON.stringify(currClient));
      doSend(client, JSON.stringify(currClient), true);
    });
  });
  client.on('disconnect', function(){
    console.log("***** disconnecting");
    var cli = clientManager.removeClientByCId(client.id),
        nick;
    if (!cli) return; 
    nick = cli.nickname;
    
    log("client " + nick+ " disconnected");
    log("*** number of connected clients is " + clientManager.getClients().length);
    doSend(client,JSON.stringify({'id': cli.id, 'action': 'close', 'nickname': nick}), true);
  });

});
function sendExistingClients(client, callback) {
 console.log("New client, sending clients");
  var clis = clientManager.getClients();
  cli = 0;
  _u.each(clis, function(oldCli){
    if (oldCli.id !== client.id) {
      log('Sending ' + oldCli.id);
      oldCli.action = "position";
      doSend(client,JSON.stringify(oldCli), false);
    } else log('same id **');
  });
  if (callback) callback(client);
}

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

mongooseAuth.helpExpress(server);
exports.User = User;

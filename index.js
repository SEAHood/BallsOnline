//var app = require('express')();
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//app.use('/js', express.static(__dirname + '/node_modules/'));

app.use(express.static(__dirname + '/js'));
app.use(express.static(__dirname + '/img'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

//2 for laziness
var allPlayers = [];
//var playerConnected = [];

io.on('connection', function(socket){
    var address = socket.request.connection.remoteAddress;
	console.log("Connection from: " + address);	
	
	socket.on('movement', function(player) {
		io.emit('movement', player);
		var seconds = new Date().getTime() / 1000;
		//console.log('[' + seconds + ']' + player.guid);
		
	});
		
	socket.on('chat message', function(data){
		console.log("Message received from " + address + " - Body: " + data.msg);
		io.emit('chat message', data);
    });
	
	socket.on('test', function(){
		console.log("Test received");
    });
	
	socket.on('player joined', function(guid) {
		console.log("Player joined with guid: " + guid);
		if (!(guid in allPlayers)) {
			console.log("Registering player with guid: " + guid);
			allPlayers[guid] = socket;
			//playerConnected[guid] = true;
		}
		
		io.emit('player joined', guid);
	});

	socket.on('disconnect', function() {
		console.log('Got disconnect!');

		for (guid in allPlayers) {
			var s = allPlayers[guid];
			console.log("Checking socket for guid: " + guid);
			console.log(s == socket);
			if (s == socket) {		
				console.log("Socket found in allPlayers, dropping guid: " + guid);
				io.emit('player left', guid);
				
				//var guidIndex = allPlayers.indexOf(guid);
				//allPlayers.splice(guidIndex, 1);
				//delete allPlayers[guid];
				delete allPlayers[guid];
				allPlayers.splice(guid, 1);
			}
		}
		//console.log(socket.server.sockets);
		//console.log(socket.id);
		//delete socket.server.sockets.sockets[socket.id];
	});
	
	
	socket.on('alive', function(guid) {
		if (!(guid in allPlayers)) {
			console.log("Registering player with guid: " + guid);
			allPlayers[guid] = socket;
			//playerConnected[guid] = true;
		}
	});
	
	
	// setInterval(function() {
		// var size = 0;
		// for (i in allPlayers) {
			// size++;
		// }
		
		// console.log("Checking connected sockets (" + size + " sockets registered)");
		// //console.log(allPlayers);
		// var thisSocketFound = false;
		
		// for (guid in allPlayers) {
			// var s = allPlayers[guid];
			// console.log(guid);
			
			
			// if (s.disconnected) {
				// console.log("Socket closed with guid: " + guid);
				// console.log("Dropping guid: " + guid);
				// io.emit('player left', guid);
				
				// //var guidIndex = allPlayers.indexOf(guid);
				// //console.log(guidIndex);
				// delete allPlayers[guid];
				// allPlayers.splice(guid, 1);
			// }			
			
			// if (s == socket) {	
				// thisSocketFound = true;
			// }
		// }
		
		// if (!thisSocketFound) {
			// //Unregistered socket found - ask for update
			// //console.log("Unregistered socket found - requesting client update");
			// //io.emit('alive');
			
			// //TODO: emit alive and register alive call, wait to see if it replies and close if not
			// socket.emit('closed');
			// console.log("Unregistered socket found - closing connection");
			// socket.disconnect();
		// }
		
	// }, 5000);
});


http.listen(3000, function(){
	console.log('listening on *:3000');
});
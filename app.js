var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/js'));
app.use(express.static(__dirname + '/img'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

var allPlayers = [];

function logMessage(type, content) {
		var dt = new Date();
	var d = new Date;
    var dFormatted = [
						d.getDate() < 10 ? '0' + d.getDate() : d.getDate(),
						d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1,
						d.getFullYear()
					].join('/') 
					+ ' ' +
					[
						d.getHours() < 10 ? '0' + d.getHours() : d.getHours(),
						d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes(),
						d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds()
					].join(':');
				   
	console.log("[" + dFormatted + "][" + type + "]: " + content);
}

io.on('connection', function(socket){
    var address = socket.request.connection.remoteAddress;
	//console.log("[CONNECTION]: " + address);	
	
	socket.on('movement', function(player) {
		io.emit('movement', player);
	});
		
	socket.on('chat message', function(data){
		logMessage('MESSAGE', data.guid.substring(0, 5) + ": " + data.msg);
		io.emit('chat message', data);
    });
	
	socket.on('test', function(){
		console.log("Test received");
    });
	
	var timeout;
	socket.on('disconnect', function() {
		for (guid in allPlayers) {
			var s = allPlayers[guid];
			if (s == socket) {		
				logMessage('DISCONNECT', guid);
				io.emit('player left', guid);
				clearTimeout(timeout);
				
				delete allPlayers[guid];
				allPlayers.splice(guid, 1);
			}
		}
				
		var size = 0;
		for (i in allPlayers) {
			size++;
		}		
		logMessage('CHECKING SOCKETS', size + " sockets registered");
	});
	
	socket.on('alive', function(player) {	
		var timeoutInMs = 6000;		
		clearTimeout(timeout);
		
		if (!(player.guid in allPlayers)) {
			logMessage('CONNECT', player.guid);
			logMessage('REGISTERING PLAYER', player.guid);
			allPlayers[player.guid] = socket;
			io.emit('player joined', player);
		
			var size = 0;
			for (i in allPlayers) {
				size++;
			}		
			logMessage('CHECKING SOCKETS', size + " sockets registered");
		}		
		
		timeout = setTimeout(function() { 
			logMessage('TIMEOUT', guid);
			for (guid in allPlayers) {
				var s = allPlayers[guid];
				if (s == socket) {
					io.emit('player left', guid);
					
					delete allPlayers[guid];
					allPlayers.splice(guid, 1);
				}
			}
		}, timeoutInMs);		
	});
});


http.listen(3000, function(){
	console.log('listening on *:3000');
});
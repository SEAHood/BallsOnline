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

io.on('connection', function(socket){
    var address = socket.request.connection.remoteAddress;
	console.log("Connection from: " + address);	
	
	socket.on('movement', function(player) {
		io.emit('movement', player);
		var seconds = new Date().getTime() / 1000;
		console.log('[' + seconds + ']' + player.guid);
	});
	
	
	socket.on('chat message', function(msg, user){
		console.log("Message received from " + user + " - Body: " + msg);
		io.emit('chat message', msg, user);
    });
});


http.listen(3001, function(){
	console.log('listening on *:3001');
});
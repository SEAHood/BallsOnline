///<reference path="../typings/socket.io/socket.io.d.ts"/>
///<reference path="../typings/jquery/jquery.d.ts"/>
import io = require("socket.io");
import $ = require("jquery");

class Chat {
	constructor() { 		
		var socket = io.connect("82.36.121.144:3000"); //How can this be.. better?
		socket.on('chat message', function(msg){
			$('#messages').append($('<li>').text("<" + "test" + "> " + msg));
			$('#messages').scrollTop($('#messages')[0].scrollHeight);
		});
		
		
		$('form').submit(function(){
			if ($('#m').val() != "") {
				socket.emit('chat message', $('#m').val());
				$('#m').val('');
			}
			return false;
		});
	}
}

//Export class
export = Chat;
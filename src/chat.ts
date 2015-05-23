///<reference path="../typings/socket.io/socket.io.d.ts"/>
///<reference path="../typings/jquery/jquery.d.ts"/>
import io = require("socket.io");
import $ = require("jquery");

class Chat {
	constructor(guid: String, color: any) { 			
		var socket = io.connect("82.36.121.144:3000"); //How can this be.. better?
		socket.on('chat message', function(data){	
			var li = "<li><span style='color:" + data.color + ";'>" + data.guid.substring(0, 5) + "</span>: " + data.msg;
			//$('#messages').append($('<li>').text("<" + data.guid.substring(0, 5) + "> " + data.msg));
			$('#messages').append(li);
			$('#messages').scrollTop($('#messages')[0].scrollHeight);
		});
		
		
		$('form').submit(function(){
			if ($('#m').val() != "") {
				socket.emit('chat message', { 'guid': guid, 'msg': $('#m').val(), 'color': color });
				$('#m').val('');
			}
			return false;
		});
	}
	
	addMessage(guid: String) {
		
	}	
		
	playerJoined(guid: String) {
		
	}
	
	playerLeft(guid: String) {
		
	}	
}

//Export class
export = Chat;
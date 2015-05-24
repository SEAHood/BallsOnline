///<reference path="../typings/socket.io/socket.io.d.ts"/>
///<reference path="../typings/jquery/jquery.d.ts"/>
import io = require("socket.io");
import $ = require("jquery");

class Chat {
	constructor(guid: String, color: any) { 			
		var socket = io.connect("82.36.121.144:3000"); //How can this be.. better?
		var chat = this;
		
		socket.on('chat message', function(data){	
			var li = "<li><span style='color:" + data.color + ";'>" + data.guid.substring(0, 5) + "</span>: " + data.msg;
			//$('#messages').append($('<li>').text("<" + data.guid.substring(0, 5) + "> " + data.msg));
			$('#messages').append(li);
			$('#messages').scrollTop($('#messages')[0].scrollHeight);
		});
		
		socket.on('death', function(data) {	
			var ballsDroppedOrdinality = chat.ordinalSuffixOf(data.ballsDropped);
			var li = "<li><span style='color:" + data.color + ";'>" + data.guid.substring(0, 5) + "</span> dropped their ball for the " + ballsDroppedOrdinality + " time!";
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
	
	ordinalSuffixOf(i: number) {
		var j = i % 10,
			k = i % 100;
		if (j == 1 && k != 11) {
			return i + "st";
		}
		if (j == 2 && k != 12) {
			return i + "nd";
		}
		if (j == 3 && k != 13) {
			return i + "rd";
		}
		return i + "th";
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
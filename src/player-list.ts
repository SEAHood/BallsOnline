///<reference path="../typings/socket.io/socket.io.d.ts"/>
///<reference path="../typings/jquery/jquery.d.ts"/>
import io = require("socket.io");
import $ = require("jquery");

class PlayerList {
	allPlayers: any[];
	socket: any;		

	constructor() { 	
		this.socket = io.connect("82.36.121.144:3000"); //How can this be.. better?
		var PlayerList = this;
		PlayerList.allPlayers = [];
		
		this.socket.on('player joined', function(player) {
			PlayerList.allPlayers[player.guid] = { 'name': player.guid.substring(0, 5), 'color': player.color };
			PlayerList.updateList();
		});
		
		this.socket.on('nick change', function(guid, nick) {
		console.log("COME ON");
			PlayerList.allPlayers[guid].name = nick;
			PlayerList.updateList();
		});
		
		this.socket.on('player alive', function(player) {
			if (typeof PlayerList.allPlayers[player.guid] === 'undefined') {
				var playerName = typeof player.nick === 'undefined' ? player.guid.substring(0, 5) : player.nick;
				PlayerList.allPlayers[player.guid] = { 'name': playerName, 'color': player.color };
				PlayerList.updateList();
			}
		});
		
		this.socket.on('player left', function(guid) {
			PlayerList.allPlayers.splice(guid, 1);
			delete PlayerList.allPlayers[guid];
			PlayerList.updateList();
		});
		
	}
	
	updateList() {	
		$('#player-list').empty();
		for (var guid in this.allPlayers) {
			var player = this.allPlayers[guid];
			var li = "<li><span style='color:" + player.color + ";'>" + player.name + "</span></li>";
			$('#player-list').append(li);		}

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
export = PlayerList;
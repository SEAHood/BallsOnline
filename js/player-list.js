define(["require", "exports", "socket.io", "jquery"], function (require, exports, io, $) {
    var PlayerList = (function () {
        function PlayerList() {
            this.socket = io.connect(); //How can this be.. better?
            var PlayerList = this;
            PlayerList.allPlayers = [];
            this.socket.on('player joined', function (player) {
                PlayerList.allPlayers[player.guid] = { 'name': player.guid.substring(0, 5), 'color': player.color };
                PlayerList.updateList();
            });
            this.socket.on('nick change', function (guid, nick) {
                console.log("COME ON");
                PlayerList.allPlayers[guid].name = nick;
                PlayerList.updateList();
            });
            this.socket.on('player alive', function (player) {
                if (typeof PlayerList.allPlayers[player.guid] === 'undefined') {
                    var playerName = typeof player.nick === 'undefined' ? player.guid.substring(0, 5) : player.nick;
                    PlayerList.allPlayers[player.guid] = { 'name': playerName, 'color': player.color };
                    PlayerList.updateList();
                }
            });
            this.socket.on('player left', function (guid) {
                PlayerList.allPlayers.splice(guid, 1);
                delete PlayerList.allPlayers[guid];
                PlayerList.updateList();
            });
        }
        PlayerList.prototype.updateList = function () {
            $('#player-list').empty();
            for (var guid in this.allPlayers) {
                var player = this.allPlayers[guid];
                var li = "<li><span style='color:" + player.color + ";'>" + player.name + "</span></li>";
                $('#player-list').append(li);
            }
        };
        PlayerList.prototype.ordinalSuffixOf = function (i) {
            var j = i % 10, k = i % 100;
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
        };
        PlayerList.prototype.addMessage = function (guid) {
        };
        PlayerList.prototype.playerJoined = function (guid) {
        };
        PlayerList.prototype.playerLeft = function (guid) {
        };
        return PlayerList;
    })();
    return PlayerList;
});

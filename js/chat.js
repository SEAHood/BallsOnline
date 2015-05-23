define(["require", "exports", "socket.io", "jquery"], function (require, exports, io, $) {
    var Chat = (function () {
        function Chat(guid, color) {
            var socket = io.connect("82.36.121.144:3000"); //How can this be.. better?
            socket.on('chat message', function (data) {
                var li = "<li><span style='color:" + data.color + ";'>" + data.guid.substring(0, 5) + "</span>: " + data.msg;
                //$('#messages').append($('<li>').text("<" + data.guid.substring(0, 5) + "> " + data.msg));
                $('#messages').append(li);
                $('#messages').scrollTop($('#messages')[0].scrollHeight);
            });
            $('form').submit(function () {
                if ($('#m').val() != "") {
                    socket.emit('chat message', { 'guid': guid, 'msg': $('#m').val(), 'color': color });
                    $('#m').val('');
                }
                return false;
            });
        }
        Chat.prototype.addMessage = function (guid) {
        };
        Chat.prototype.playerJoined = function (guid) {
        };
        Chat.prototype.playerLeft = function (guid) {
        };
        return Chat;
    })();
    return Chat;
});

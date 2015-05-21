define(["require", "exports", "socket.io", "jquery"], function (require, exports, io, $) {
    var Chat = (function () {
        function Chat() {
            var socket = io.connect("82.36.121.144:3000"); //How can this be.. better?
            socket.on('chat message', function (msg) {
                $('#messages').append($('<li>').text("<" + "test" + "> " + msg));
                $('#messages').scrollTop($('#messages')[0].scrollHeight);
            });
            $('form').submit(function () {
                if ($('#m').val() != "") {
                    socket.emit('chat message', $('#m').val());
                    $('#m').val('');
                }
                return false;
            });
        }
        return Chat;
    })();
    return Chat;
});

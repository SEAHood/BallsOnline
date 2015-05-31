define(["require", "exports", "socket.io", "jquery"], function (require, exports, io, $) {
    var Chat = (function () {
        function Chat(guid, color) {
            this.guid = guid;
            this.color = color;
            this.socket = io.connect("82.36.121.144:3000"); //How can this be.. better?
            var chat = this;
            this.socket.on('chat message', function (data) {
                var sender;
                console.log(data);
                if (typeof data.nick != 'undefined') {
                    sender = data.nick;
                }
                else {
                    sender = data.guid.substring(0, 5);
                }
                var li = "<li><span style='color:" + data.color + ";'>" + sender + "</span>: " + data.msg + "</li>";
                //$('#messages').append($('<li>').text("<" + data.guid.substring(0, 5) + "> " + data.msg));
                $('#messages').append(li);
                $('#messages').scrollTop($('#messages')[0].scrollHeight);
            });
            this.socket.on('error', function (msg) {
                var li = "<li><span style='color: #4e0f1a;'>" + msg + "</span></li>";
                //$('#messages').append($('<li>').text("<" + data.guid.substring(0, 5) + "> " + data.msg));
                $('#messages').append(li);
                $('#messages').scrollTop($('#messages')[0].scrollHeight);
            });
            this.socket.on('info', function (msg) {
                //this.appendInfo(msg);
                var li = "<li><span style='color: #796817;'>" + msg + "</span></li>";
                //$('#messages').append($('<li>').text("<" + data.guid.substring(0, 5) + "> " + data.msg));
                $('#messages').append(li);
                $('#messages').scrollTop($('#messages')[0].scrollHeight);
            });
            this.socket.on('death', function (data) {
                var ballsDroppedOrdinality = chat.ordinalSuffixOf(data.ballsDropped);
                var li = "<li><span style='color:" + data.color + ";'>" + data.guid.substring(0, 5) + "</span> dropped their ball for the " + ballsDroppedOrdinality + " time!" + "</li>";
                $('#messages').append(li);
                $('#messages').scrollTop($('#messages')[0].scrollHeight);
            });
            var chat = this;
            $('form').submit(function () {
                if ($('#m').val() != "") {
                    if ($('#m').val().substring(0, 1) == "/") {
                        chat.handleChatCommand($('#m').val());
                        $('#m').val('');
                        $('#m').blur();
                    }
                    else {
                        chat.socket.emit('chat message', { 'guid': guid, 'msg': $('#m').val(), 'color': color });
                        $('#m').val('');
                        $('#m').blur();
                    }
                }
                // else {
                // $('#m').blur();
                // }
                // if ($('#m').is(":focus")
                return false;
            });
            $(document).keydown(function (e) {
                if (!$(e.target).is('input')) {
                    var prevent = true;
                    // Update the state of the attached control to "true"
                    switch (e.keyCode) {
                        case 13:
                        case 191:
                            $('#m').focus();
                            break;
                        default:
                            break;
                    }
                }
            });
            this.chatJazz = new Audio('StandardJazzBars.mp3');
            //this.chatJazz.play();
            this.appendInfo("Hit up some jazz with /jazzmeup");
        }
        Chat.prototype.handleChatCommand = function (command) {
            var tokens = command.split(" ");
            var chatCommand = tokens[0].substring(1, tokens[0].length);
            switch (chatCommand) {
                case "nick":
                    var nick = tokens[1];
                    console.log(nick);
                    if (nick) {
                        if (nick.length < 15) {
                            this.socket.emit('nick change', this.guid, nick);
                            break;
                        }
                    }
                    this.socket.emit('error', "Invalid nickname (must be between 1 and 15 characters)");
                    break;
                case "ihatejazz":
                    this.chatJazz.pause();
                    this.chatJazz.currentTime = 0;
                    this.appendInfo("That's not cool, but suit yourself (start music with /jazzmeup)");
                    break;
                case "jazzmeup":
                    this.chatJazz.play();
                    break;
                default:
                    this.socket.emit('error', "Invalid command");
                    break;
            }
            console.log(chatCommand);
        };
        Chat.prototype.appendInfo = function (msg) {
            var li = "<li><span style='color: #796817;'>" + msg + "</span></li>";
            //$('#messages').append($('<li>').text("<" + data.guid.substring(0, 5) + "> " + data.msg));
            $('#messages').append(li);
            $('#messages').scrollTop($('#messages')[0].scrollHeight);
        };
        Chat.prototype.ordinalSuffixOf = function (i) {
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

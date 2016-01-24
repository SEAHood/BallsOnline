define(["require", "exports", "socket.io"], function (require, exports, io) {
    //IS THIS WORTH IT? Scope issues with callbacks on 'on'
    var Network = (function () {
        function Network() {
            this.socket = io.connect(); //How can this be.. better?
        }
        Network.prototype.on = function (event, callback) {
            this.socket.on(event, callback);
        };
        Network.prototype.emit = function (event, data) {
            this.socket.emit(event, data);
        };
        return Network;
    })();
    return Network;
});

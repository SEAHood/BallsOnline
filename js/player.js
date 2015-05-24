define(["require", "exports"], function (require, exports) {
    var Player = (function () {
        function Player(color) {
            console.log("creating player");
            this.guid = this.generateGuid();
            this.color = this.generateColor();
            this.username = '1234';
            this.mesh = new THREE.Mesh(new THREE.SphereGeometry(5, 32, 32), new THREE.MeshLambertMaterial({ color: this.color }));
            this.mesh.castShadow = true;
            this.mesh.receiveShadow = true;
            this.mesh.position.x = 0;
            this.mesh.position.y = 10;
            this.mesh.position.z = 0;
        }
        Player.prototype.generateGuid = function () {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        };
        Player.prototype.generateColor = function () {
            var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        };
        return Player;
    })();
    return Player;
});

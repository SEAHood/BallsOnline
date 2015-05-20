define(["require", "exports"], function (require, exports) {
    var Player = (function () {
        function Player(color) {
            this.guid = '1234';
            this.username = '1234';
            this.model = new THREE.Mesh(new THREE.SphereGeometry(5, 32, 32), new THREE.MeshLambertMaterial({ color: 0xFFFFFF }));
            this.model.castShadow = true;
            this.model.receiveShadow = true;
            this.model.position.y = 10;
        }
        return Player;
    })();
    return Player;
});

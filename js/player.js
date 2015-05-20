define(["require", "exports"], function (require, exports) {
    var Player = (function () {
        function Player(color) {
            console.log("creating player");
            this.guid = '1234';
            this.username = '1234';
            this.mesh = new THREE.Mesh(new THREE.SphereGeometry(5, 32, 32), new THREE.MeshLambertMaterial({ color: 0xFFFFFF }));
            this.mesh.castShadow = true;
            this.mesh.receiveShadow = true;
            this.mesh.position.y = 10;
        }
        return Player;
    })();
    return Player;
});

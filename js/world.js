define(["require", "exports", "physijs"], function (require, exports, PhysiJS) {
    var World = (function () {
        function World() {
            var texture = THREE.ImageUtils.loadTexture("metal2.jpg");
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            var friction = 1; // high friction
            var restitution = 1; // low restitution
            var terrainMaterial = PhysiJS.createMaterial(new THREE.MeshLambertMaterial({ map: texture }), friction, restitution);
            var terrainGeometry = new THREE.BoxGeometry(200, 10, 200);
            //var terrainMaterial = new THREE.MeshLambertMaterial({ map: texture });
            this.terrain = new PhysiJS.BoxMesh(terrainGeometry, terrainMaterial, 0);
            //terrain.receiveShadow = true;
        }
        World.prototype.addToScene = function (scene) {
            scene.add(this.terrain);
        };
        return World;
    })();
    return World;
});

define(["require", "exports"], function (require, exports) {
    var World = (function () {
        function World() {
            var texture = THREE.ImageUtils.loadTexture("metal2.jpg");
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            var terrainGeometry = new THREE.BoxGeometry(200, 10, 200);
            var terrainMaterial = new THREE.MeshLambertMaterial({ map: texture });
            this.terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
            //terrain.receiveShadow = true;
        }
        return World;
    })();
    return World;
});

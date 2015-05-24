define(["require", "exports", "physijs"], function (require, exports, PhysiJS) {
    var World = (function () {
        function World() {
            this.terrain = [];
            this.lighting = [];
            var texture = THREE.ImageUtils.loadTexture("textures/rocks.jpg");
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(2, 2);
            //var friction = 1; // high friction
            //var restitution = 1; // low restitution
            var terrainMaterial = PhysiJS.createMaterial(new THREE.MeshLambertMaterial({ map: texture }));
            var terrainGeometry = new THREE.BoxGeometry(200, 10, 200);
            //var terrainMaterial = new THREE.MeshLambertMaterial({ map: texture });
            this.terrain.push(new PhysiJS.BoxMesh(terrainGeometry, terrainMaterial, 0));
            //terrain.receiveShadow = true;
            //this.light = new THREE.AmbientLight( 0xFFFFFF, 0.2 ); // soft white light
            //this.scene.add(this.light);
            //0xB29D88
            //0xE5C089
            var light = new THREE.HemisphereLight(0xB29D88, 0x777C82, 0.5);
            this.lighting.push(light);
            var wallGeometry = new THREE.BoxGeometry(10, 1000, 200);
            var wall1 = new PhysiJS.BoxMesh(wallGeometry, terrainMaterial, 0);
            wall1.position.set(-80, 540, 0);
            var wall2 = new PhysiJS.BoxMesh(wallGeometry, terrainMaterial, 0);
            wall2.position.set(-150, 540, 0);
            this.terrain.push(wall1);
            this.terrain.push(wall2);
            for (var i = 0; i < 30; i++) {
                var t = new PhysiJS.BoxMesh(terrainGeometry, terrainMaterial, 0);
                t.position.set(i * 200, i * 40, 0);
                t.receiveShadow = true;
                //var l = new THREE.PointLight( 0xffff00, 1, 100 );
                //l.position.set(i * 200, (i * 40) + 20, 0);
                var l = new THREE.PointLight(0xFFFFFF, 1, 200);
                l.position.set(i * 200, (i * 40) + 60, 0);
                var lb = new PhysiJS.BoxMesh(new THREE.SphereGeometry(1, 10, 10), new THREE.MeshBasicMaterial({ color: 0xFFFFFF }), 0);
                lb.position.set(i * 200, (i * 40) + 60, 0);
                //l.shadowMapWidth = 100;
                //l.shadowMapHeight = 100;
                //l.shadowCameraNear = 10;
                //l.shadowCameraFar = 100;
                //l.shadowCameraFov = 30;
                //l.target = t;
                //l.shadowCameraVisible = true;
                //console.log(l.position);
                this.lighting.push(l);
                this.terrain.push(lb);
                this.terrain.push(t);
            }
        }
        World.prototype.addToScene = function (scene) {
            for (var i in this.terrain) {
                scene.add(this.terrain[i]);
            }
            for (var i in this.lighting) {
                scene.add(this.lighting[i]);
            }
        };
        return World;
    })();
    return World;
});

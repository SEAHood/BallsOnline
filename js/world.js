define(["require", "exports", "physijs"], function (require, exports, PhysiJS) {
    var World = (function () {
        function World(scene, player) {
            this.terrain = [];
            this.lighting = [];
            this.scene = scene;
            this.isLoaded = false;
            var texture = THREE.ImageUtils.loadTexture("textures/rocks.jpg");
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(3, 3);
            var terrainMaterial = PhysiJS.createMaterial(new THREE.MeshLambertMaterial({ map: texture }));
            var terrainGeometry = new THREE.BoxGeometry(200, 10, 200);
            this.terrain.push(new PhysiJS.BoxMesh(terrainGeometry, terrainMaterial, 0));
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
                var l = new THREE.PointLight(0xFFFFFF, 1, 200);
                l.position.set(i * 200, (i * 40) + 60, 0);
                var lb = new PhysiJS.BoxMesh(new THREE.SphereGeometry(1, 10, 10), new THREE.MeshBasicMaterial({ color: 0xFFFFFF }), 0);
                lb.position.set(i * 200, (i * 40) + 60, 0);
            }
            var directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
            directionalLight.position.set(10000, 5500, 10000);
            //scene.add( directionalLight );
            directionalLight.castShadow = true;
            directionalLight.shadowDarkness = 0.3;
            directionalLight.shadowMapHeight = 4196;
            directionalLight.shadowMapWidth = 4196;
            //directionalLight.shadowCameraVisible = true;
            directionalLight.shadowCameraFar = 30000;
            directionalLight.shadowCameraRight = 2500;
            directionalLight.shadowCameraLeft = -2500;
            directionalLight.shadowCameraTop = 2500;
            directionalLight.shadowCameraBottom = -2500;
            directionalLight.target.position = new THREE.Vector3(0, 0, 0);
            this.lighting.push(directionalLight);
            var img = new Image();
            var terrain = this.terrain;
            var world = this;
            img.onload = function () {
                console.log("IMAGE LOADED");
                var data = world.getHeightData(img, 10);
                var ground_material;
                ground_material = Physijs.createMaterial(new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture('threejs_heightmap_texture_desert_secrets.jpg'), wireframe: false }), .8, .4 // low restitution
                );
                ground_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
                ground_material.map.repeat.set(1, 1);
                var ground_geometry = new THREE.PlaneGeometry(10000, 10000, 249, 249);
                console.log(ground_geometry.vertices.length);
                console.log(data.length);
                for (var i = 0, l = ground_geometry.vertices.length; i < l; i++) {
                    var terrainValue = data[i] / 255;
                    ground_geometry.vertices[i].z = ground_geometry.vertices[i].z + terrainValue * 1000;
                }
                //ground_geometry.computeFaceNormals();
                //ground_geometry.computeVertexNormals();
                var ground = new PhysiJS.HeightfieldMesh(ground_geometry, ground_material, 0, 249, 249);
                ground.rotation.x = Math.PI / -2;
                ground.receiveShadow = true;
                //scene.add( ground );
                world.terrain.push(ground);
                world.addToScene();
                console.log(terrain);
                //TEMPORARY HACK
                world.addToScene();
                world.scene.add(player);
            };
            img.src = "threejs_heightmap.png";
        }
        World.prototype.addToScene = function () {
            //for (var i in this.terrain) {
            //	this.scene.add(this.terrain[i]);
            //}
            this.scene.add(this.terrain[this.terrain.length - 1]);
            for (var i in this.lighting) {
                this.scene.add(this.lighting[i]);
            }
        };
        World.prototype.getHeightData = function (img, scale) {
            if (scale == undefined)
                scale = 1;
            var canvas;
            var context;
            canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            context = canvas.getContext('2d');
            canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
            var imgData = canvas.getContext('2d').getImageData(0, 0, img.height, img.width).data;
            var data = [];
            var j = 0;
            for (var i = 0; i < imgData.length; i += 4) {
                var all = imgData[i] + imgData[i + 1] + imgData[i + 2];
                data[j++] = all / 12; //imgData[i + 3];
            }
            return data;
        };
        return World;
    })();
    return World;
});

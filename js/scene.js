///<reference path="../typings/threejs/three.d.ts"/>
///<reference path="../typings/jquery/jquery.d.ts"/>
///<reference path="../typings/stats/stats.d.ts"/>
///<reference path="../typings/physijs/physijs.d.ts"/>
define(["require", "exports", "jquery", "stats", "./player", "./world", "socket.io", "physijs"], function (require, exports, jQuery, Stats, Player, World, io, PhysiJS) {
    // import Test = BallsOnline.Test;
    var Scene = (function () {
        //controls: any;
        function Scene() {
            this.controls = {
                jumping: false,
                space: false,
                left: false,
                up: false,
                right: false,
                down: false
            };
            this.rPlayers = [];
            this.socket = io.connect("82.36.121.144:3000"); //How can this be.. better?
            console.log("starting scene init");
            this.container = jQuery('#test');
            // Create a scene, a camera, a light and a WebGL renderer with Three.JS
            this.scene = new PhysiJS.Scene({ fixedTimeStep: 1 / 60 });
            this.scene.setGravity(new THREE.Vector3(0, -150, 0));
            //Setup camera
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50000);
            this.camera.position.x = 0;
            this.camera.position.y = 50;
            this.camera.position.z = -70;
            this.scene.add(this.camera);
            //Setup light
            this.light = new THREE.PointLight(0xffffff, 1, 100);
            this.light.position.set(-10, 20, 10);
            //this.light.shadowDarkness = 0.5;
            //this.light.shadowCameraVisible = true;
            this.scene.add(this.light);
            this.light = new THREE.AmbientLight(0x707070); // soft white light
            this.scene.add(this.light);
            //Setup renderer
            this.renderer = new THREE.WebGLRenderer();
            //this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.shadowMapEnabled = true;
            this.renderer.shadowMapType = THREE.PCFSoftShadowMap;
            document.body.appendChild(this.renderer.domElement);
            // Define the container for the renderer
            //this.container = $('body');
            this.world = new World();
            this.world.addToScene(this.scene);
            //this.scene.add(this.world.terrain);
            //this.cameraControls = new THREE.OrbitControls(this.camera, this.renderer.domElement); 
            //this.cameraControls.noPan = true;
            //this.cameraControls.addEventListener('change', this.frame);
            this.stats = new Stats();
            document.body.appendChild(this.stats.domElement);
            // Create the user's character
            this.player = new Player({
                color: 0x7A43B6
            });
            this.scene.add(this.player.mesh);
            this.socket.emit('alive', { 'guid': this.player.guid, 'color': this.player.color, 'position': this.player.mesh.position });
            this.ballsDropped = 0;
            //this.socket.emit('movement', { 'guid': this.player.guid, 'color': this.player.color, 'position': this.player.mesh.position });//{'guid': this.player.guid, 'color': this.player.color, 'position': 
            //this.socket.emit('movement', {'guid': this.player.guid, 'color': this.player.color, 'position': this.player.mesh.position});
            //this.socket.emit('player joined', this.player.guid);
            // Create the "world" : a 3D representation of the place we'll be putting our character in
            //this.world = new World({
            //	color: 0xF5F5F5
            //});
            //this.scene.add(this.world.mesh);
            // Define the size of the renderer
            this.setAspect();
            // Insert the renderer in the container
            //this.container.prepend(this.renderer.domElement);
            // Set the camera to look at our user's character
            //this.setFocus(this.user.mesh);
            // Start the events handlers
            this.setControls();
            this.createSkybox();
            //var stats = new Stats();
            //document.body.appendChild(Stats.domElement);	
            console.log("ending scene init");
            //console.log("EMITTING: " + this.player.guid);
        }
        Scene.prototype.createSkybox = function () {
            var urlPrefix = "skybox/stormydays_";
            var urls = [
                urlPrefix + "ft.jpg", urlPrefix + "bk.jpg",
                urlPrefix + "up.jpg", urlPrefix + "dn.jpg",
                urlPrefix + "rt.jpg", urlPrefix + "lf.jpg"];
            var materialArray = [];
            for (var i = 0; i < 6; i++) {
                materialArray.push(new THREE.MeshBasicMaterial({
                    map: THREE.ImageUtils.loadTexture(urls[i]),
                    side: THREE.BackSide
                }));
            }
            var skyGeometry = new THREE.CubeGeometry(50000, 50000, 50000);
            var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
            var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
            this.scene.add(skyBox);
        };
        // Event handlers
        Scene.prototype.setControls = function () {
            //socket events - MOVE THIS
            var player = this.player;
            var rPlayers = this.rPlayers;
            var scene = this.scene;
            var socket = this.socket;
            //TODO SORT THE FUCKIGN MOVEMENT OUT LOL
            this.socket.on('movement', function (rPlayer) {
                if (rPlayer.guid != player.guid) {
                    //console.log("detected other player movement");
                    //New player found - from position announce via other clients - perhaps refactor this into another call (fine for now)
                    if (!(rPlayer.guid in rPlayers)) {
                        //var color = getRandomColor();	
                        //console.log("NEW PLAYER FOUND");
                        rPlayers[rPlayer.guid] = new PhysiJS.SphereMesh(new THREE.SphereGeometry(5, 32, 32), new THREE.MeshLambertMaterial({ color: rPlayer.color }));
                        rPlayers[rPlayer.guid].position.set(rPlayer.position.x, rPlayer.position.y, rPlayer.position.z);
                        rPlayers[rPlayer.guid].__dirtyPosition = true;
                        rPlayers[rPlayer.guid].setLinearVelocity(rPlayer.velocity);
                        //rPlayers[rPlayer.guid].__dirtyPosition = true;
                        scene.add(rPlayers[rPlayer.guid]);
                    }
                    else {
                        //console.log(rPlayer);
                        //rPlayers[rPlayer.guid].__dirtyPosition = true;
                        rPlayers[rPlayer.guid].position.set(rPlayer.position.x, rPlayer.position.y, rPlayer.position.z);
                        rPlayers[rPlayer.guid].__dirtyPosition = true;
                        rPlayers[rPlayer.guid].setLinearVelocity(rPlayer.velocity);
                    }
                }
            });
            this.socket.on('player left', function (guid) {
                //console.log("Player left: " + guid);
                for (var i in rPlayers) {
                    var rPlayer = rPlayers[i];
                    if (i == guid) {
                        console.log("Player found in rPlayers");
                        rPlayers.splice(i, 1);
                        scene.remove(rPlayer);
                        //TODO: DO THIS IN CHAT.TS
                        $('#messages').append($('<li class="player-left">').text(guid.substring(0, 5) + " left"));
                        $('#messages').scrollTop($('#messages')[0].scrollHeight);
                        break;
                    }
                }
            });
            this.socket.on('player joined', function (rPlayer) {
                //Player joined - emit your own position
                //TODO: DO THIS IN CHAT.TS
                //console.log("PLAYER JOINED");
                if (rPlayer.guid != player.guid) {
                    rPlayers[rPlayer.guid] = new PhysiJS.SphereMesh(new THREE.SphereGeometry(5, 32, 32), new THREE.MeshLambertMaterial({ color: rPlayer.color }));
                    rPlayers[rPlayer.guid].position.set(rPlayer.position.x, rPlayer.position.y, rPlayer.position.z);
                    rPlayers[rPlayer.guid].__dirtyPosition = true;
                    rPlayers[rPlayer.guid].setLinearVelocity(rPlayer.velocity);
                    scene.add(rPlayers[rPlayer.guid]);
                    //console.log(rPlayers[rPlayer.guid]);
                    //Announce location
                    socket.emit('movement', { 'guid': player.guid, 'color': player.color, 'position': player.mesh.position });
                }
                $('#messages').append($('<li class="player-joined">').text(rPlayer.guid.substring(0, 5) + " joined"));
                $('#messages').scrollTop($('#messages')[0].scrollHeight);
            });
            this.socket.on('alive', function () {
                //console.log(player.guid);
                socket.emit('alive', { 'guid': player.guid, 'color': player.color, 'position': player.mesh.position });
            });
            this.socket.on('closed', function () {
                $('#messages').append($('<li class="player-left">').text("You have been disconnected"));
                $('#messages').scrollTop($('#messages')[0].scrollHeight);
            });
            setInterval(function () {
                socket.emit('alive', { 'guid': player.guid, 'color': player.color, 'position': player.mesh.position });
            }, 5000);
            //socket events - MOVE THIS
            console.log("setting controls");
            // Within jQuery's methods, we won't be able to access "this"
            //user 3w= this.user,
            // State of the different controls
            var player = this.player;
            var controls = this.controls;
            var basicScene = this;
            // When the user presses a key 
            $(document).keydown(function (e) {
                if (!$(e.target).is('input')) {
                    var prevent = true;
                    // Update the state of the attached control to "true"
                    switch (e.keyCode) {
                        case 32:
                            controls.space = true;
                            break;
                        case 37:
                            controls.left = true;
                            break;
                        case 38:
                            controls.up = true;
                            break;
                        case 39:
                            controls.right = true;
                            break;
                        case 40:
                            controls.down = true;
                            break;
                        default:
                            prevent = false;
                    }
                    // Avoid the browser to react unexpectedly
                    if (prevent) {
                        e.preventDefault();
                    }
                    else {
                        return;
                    }
                }
                // Update the character's direction
                //user.setDirection(controls);
            });
            // When the user releases a key
            $(document).keyup(function (e) {
                var prevent = true;
                // Update the state of the attached control to "false"
                switch (e.keyCode) {
                    case 32:
                        controls.space = false;
                        break;
                    case 37:
                        controls.left = false;
                        break;
                    case 38:
                        controls.up = false;
                        break;
                    case 39:
                        controls.right = false;
                        break;
                    case 40:
                        controls.down = false;
                        break;
                    default:
                        prevent = false;
                }
                // Avoid the browser to react unexpectedly
                if (prevent) {
                    e.preventDefault();
                }
                else {
                    return;
                }
                // Update the character's direction
                //user.setDirection(controls);
            });
            // On resize
            jQuery(window).resize(function () {
                // Redefine the size of the renderer
                basicScene.setAspect();
            });
        };
        // Defining the renderer's size
        Scene.prototype.setAspect = function () {
            console.log("setting aspect");
            // Fit the container's full width
            var w = window.innerWidth, 
            // Fit the initial visible area's height
            h = window.innerHeight; //jQuery(window).height() - this.container.offset().top - 20;
            // Update the renderer and the camera
            this.renderer.setSize(w, h);
            this.camera.aspect = w / h;
            this.camera.updateProjectionMatrix();
        };
        // Updating the camera to follow and look at a given Object3D / Mesh
        Scene.prototype.setFocus = function (object) {
            this.camera.position.set(object.position.x, object.position.y + 128, object.position.z - 256);
            this.camera.lookAt(object.position);
        };
        // Update and draw the scene
        Scene.prototype.frame = function () {
            this.stats.update();
            var controls = this.controls;
            var player = this.player;
            if (player.mesh.position.y < -100) {
                player.reset();
                this.ballsDropped++;
                this.socket.emit('death', { 'guid': player.guid, 'color': player.color, 'ballsDropped': this.ballsDropped });
            }
            if (player.mesh.position.y <= 0) {
                controls.jumping = false;
            }
            //var velocity = player.mesh.getLinearVelocity();
            if (controls.space || controls.left || controls.up || controls.right || controls.down) {
                var velocity = new THREE.Vector3(0, 0, 0);
                //velocity = player.mesh.getLinearVelocity();
                if (controls.space && !controls.jumping) {
                    var pVelocity = player.mesh.getLinearVelocity();
                    pVelocity.setY(100);
                    player.mesh.setLinearVelocity(pVelocity);
                    controls.jumping = true;
                    player.mesh.addEventListener('collision', function () {
                        controls.jumping = false;
                        // `this` has collided with `other_object` with an impact speed of `relative_velocity` and a rotational force of `relative_rotation` and at normal `contact_normal`
                    });
                }
                var velocity = new THREE.Vector3();
                if (controls.up)
                    velocity.setZ(2000);
                //player.mesh.setLinearVelocity(new THREE.Vector3(0, 0, 100));
                //player.mesh.position.setZ(player.mesh.position.z + 2);
                if (controls.down)
                    velocity.setZ(-2000);
                //player.mesh.setLinearVelocity(new THREE.Vector3(0, 0, -100));
                //player.mesh.position.setZ(player.mesh.position.z - 2);
                if (controls.left)
                    velocity.setX(2000);
                //player.mesh.setLinearVelocity(new THREE.Vector3(100, 0, 0));
                //player.mesh.position.setX(player.mesh.position.x + 2);
                if (controls.right)
                    velocity.setX(-2000);
                //player.mesh.setLinearVelocity(new THREE.Vector3(-100, 0, 0));
                //player.mesh.position.setX(player.mesh.position.x - 2);
                console.log(velocity);
                //player.mesh.setLinearVelocity(velocity);
                player.mesh.applyCentralImpulse(velocity);
            }
            this.socket.emit('movement', { 'guid': player.guid, 'color': player.color, 'position': player.mesh.position, 'velocity': player.mesh.getLinearVelocity() });
            // Run a new step of the user's motions
            //this.user.motion();
            // Set the camera to look at our user's character
            //this.setFocus(this.world.terrain);
            this.setFocus(this.player.mesh);
            // And draw !
            this.scene.simulate();
            this.renderer.render(this.scene, this.camera);
        };
        return Scene;
    })();
    return Scene;
});

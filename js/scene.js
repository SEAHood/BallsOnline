///<reference path="../typings/threejs/three.d.ts"/>
///<reference path="../typings/jquery/jquery.d.ts"/>
///<reference path="../typings/stats/stats.d.ts"/>
///<reference path="../typings/physijs/physijs.d.ts"/>
define(["require", "exports", "jquery", "stats", "./player", "./world", "socket.io", "physijs"], function (require, exports, jQuery, Stats, Player, World, io, PhysiJS) {
    //import OrbitControls = require("orbitcontrols");
    // import Test = BallsOnline.Test;
    var Scene = (function () {
        // controls = {
        // jumping: false,
        // space: false,
        // left: false,
        // up: false,
        // right: false,
        // down: false
        // };
        //controls: any;
        function Scene() {
            var _this = this;
            this.rPlayers = [];
            this.socket = io.connect(); //How can this be.. better?
            console.log("starting scene init");
            this.container = jQuery('#test');
            // Create a scene, a camera, a light and a WebGL renderer with Three.JS
            this.scene = new PhysiJS.Scene({ fixedTimeStep: 1 / 60 });
            this.scene.setGravity(new THREE.Vector3(0, -150, 0));
            //Setup camera
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 150000);
            this.camera.position.x = 0;
            this.camera.position.y = 50;
            this.camera.position.z = -70;
            //this.scene.add(this.camera);
            //Setup light
            this.light = new THREE.PointLight(0xffffff, 1, 100);
            this.light.position.set(-10, 20, 10);
            //this.light.shadowDarkness = 0.5;
            //this.light.shadowCameraVisible = true;
            //this.scene.add(this.light);
            this.light = new THREE.AmbientLight(0x707070); // soft white light
            //this.scene.add(this.light);
            //Setup renderer
            this.renderer = new THREE.WebGLRenderer();
            //this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.shadowMapEnabled = true;
            this.renderer.shadowMapType = THREE.PCFSoftShadowMap;
            document.body.appendChild(this.renderer.domElement);
            // Create the user's character
            this.player = new Player('placeholder');
            //this.scene.add(this.player.mesh);
            // Define the container for the renderer
            //this.container = $('body');
            setTimeout(function () { return _this.world = new World(_this.scene, _this.player.mesh); }, 0);
            //this.world.addToScene(this.scene);
            //this.scene.add(this.world.terrain);
            this.stats = new Stats();
            document.body.appendChild(this.stats.domElement);
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
            this.cameraControls = new THREE.OrbitControls(this.camera);
            this.cameraControls.noPan = true;
            this.cameraControls.addEventListener('change', function () {
                this.frame();
            }.bind(this));
            this.initPlayerText(this.player.guid.substring(0, 5));
            this.scene.add(this.playerText);
            console.log("ending scene init");
            //console.log("EMITTING: " + this.player.guid);
        }
        Scene.prototype.hexToR = function (h) { return parseInt((this.cutHex(h)).substring(0, 2), 16); };
        Scene.prototype.hexToG = function (h) { return parseInt((this.cutHex(h)).substring(2, 4), 16); };
        Scene.prototype.hexToB = function (h) { return parseInt((this.cutHex(h)).substring(4, 6), 16); };
        Scene.prototype.cutHex = function (h) { return (h.charAt(0) == "#") ? h.substring(1, 7) : h; };
        Scene.prototype.addPlayer = function () {
        };
        Scene.prototype.initPlayerText = function (text) {
            var playerR = this.hexToR(this.player.color);
            var playerG = this.hexToG(this.player.color);
            var playerB = this.hexToB(this.player.color);
            // create a canvas element
            var playerTextCanvas = document.createElement('canvas');
            playerTextCanvas.width = 200;
            playerTextCanvas.height = 30;
            var playerTextCanvasContext = playerTextCanvas.getContext('2d');
            playerTextCanvasContext.font = "Normal 16px Arial";
            playerTextCanvasContext.fillStyle = "rgba(" + playerR + "," + playerG + "," + playerB + ",0.7)";
            playerTextCanvasContext.textAlign = 'center';
            playerTextCanvasContext.fillText(text, playerTextCanvas.width / 2, playerTextCanvas.height / 1.5);
            // canvas contents will be used for a texture
            var playerTextTexture = new THREE.Texture(playerTextCanvas);
            playerTextTexture.needsUpdate = true;
            var playerTextMaterial = new THREE.MeshBasicMaterial({ map: playerTextTexture, side: THREE.DoubleSide });
            playerTextMaterial.transparent = true;
            this.playerText = new THREE.Mesh(new THREE.PlaneGeometry(playerTextCanvas.width, playerTextCanvas.height), playerTextMaterial);
            this.playerText.position.set(this.player.mesh.position.x, this.player.mesh.position.y + 20, this.player.mesh.position.z);
            this.playerText.rotation.y = Math.PI / -1;
        };
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
            var skyGeometry = new THREE.CubeGeometry(100000, 100000, 100000);
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
                        rPlayers[rPlayer.guid].castShadow = true;
                        rPlayers[rPlayer.guid].receiveShadow = true;
                        rPlayers[rPlayer.guid].position.set(rPlayer.position.x, rPlayer.position.y, rPlayer.position.z);
                        rPlayers[rPlayer.guid].__dirtyPosition = true;
                        if (typeof rPlayer.velocity != 'undefined') {
                            rPlayers[rPlayer.guid].setLinearVelocity(rPlayer.velocity);
                        }
                        //rPlayers[rPlayer.guid].__dirtyPosition = true;
                        scene.add(rPlayers[rPlayer.guid]);
                    }
                    else {
                        //console.log(rPlayer);
                        //rPlayers[rPlayer.guid].__dirtyPosition = true;
                        rPlayers[rPlayer.guid].position.set(rPlayer.position.x, rPlayer.position.y, rPlayer.position.z);
                        rPlayers[rPlayer.guid].__dirtyPosition = true;
                        if (typeof rPlayer.velocity != 'undefined') {
                            rPlayers[rPlayer.guid].setLinearVelocity(rPlayer.velocity);
                        }
                    }
                }
            });
            this.socket.on('player left', function (guid) {
                if (guid == player.guid) {
                    window.location.replace("/disconnect");
                }
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
                    rPlayers[rPlayer.guid].castShadow = true;
                    rPlayers[rPlayer.guid].receiveShadow = true;
                    rPlayers[rPlayer.guid].position.set(rPlayer.position.x, rPlayer.position.y, rPlayer.position.z);
                    rPlayers[rPlayer.guid].__dirtyPosition = true;
                    console.log(rPlayer.velocity);
                    if (typeof rPlayer.velocity != 'undefined') {
                        rPlayers[rPlayer.guid].setLinearVelocity(rPlayer.velocity);
                    }
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
            //var controls = this.controls;
            var basicScene = this;
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
            //this.camera.position.setY(object.position.y + 128);
            this.camera.lookAt(object.position);
        };
        Scene.prototype.test = function () {
            console.log("TEST");
            console.log(this);
        };
        // Update and draw the scene
        Scene.prototype.frame = function () {
            //console.log(this);
            this.stats.update();
            //console.log(this);
            //var controls = this.controls;
            var player = this.player;
            var camera = this.camera;
            this.player.update();
            if (!player.isAlive) {
                this.ballsDropped++;
                this.socket.emit('death', { 'guid': player.guid, 'color': player.color, 'ballsDropped': this.ballsDropped });
            }
            this.socket.emit('movement', { 'guid': player.guid, 'color': player.color, 'position': player.mesh.position, 'velocity': player.mesh.getLinearVelocity() });
            var playerVelocity = player.mesh.getLinearVelocity();
            $('#velocity-x').text(Math.round(playerVelocity.x) + " (x)");
            $('#velocity-y').text(Math.round(playerVelocity.y) + " (y)");
            $('#velocity-z').text(Math.round(playerVelocity.z) + " (z)");
            $('#position-x').text(Math.round(player.mesh.position.x) + " (xpos)");
            $('#position-y').text(Math.round(player.mesh.position.y) + " (ypos)");
            $('#position-z').text(Math.round(player.mesh.position.z) + " (zpos)");
            // Run a new step of the user's motions
            //this.user.motion();
            //this.user.motion();
            //Make camera avoid terrain
            // var ray = new THREE.Raycaster(camera.position, new THREE.Vector3(0, 1, 0), 5, 5);
            // if (this.world.intersects(ray)) {
            // console.log("YES");
            // camera.position.setY(camera.position.y + 1);
            // }
            this.playerText.position.set(player.mesh.position.x, player.mesh.position.y + 20, player.mesh.position.z);
            // Set the camera to look at our user's character
            //this.setFocus(this.world.terrain);
            // this.cameraControls.update();
            this.setFocus(this.player.mesh);
            // And draw !
            this.scene.simulate();
            this.renderer.render(this.scene, this.camera);
        };
        return Scene;
    })();
    return Scene;
});

///<reference path="../typings/threejs/three.d.ts"/>
///<reference path="../typings/jquery/jquery.d.ts"/>
///<reference path="../typings/stats/stats.d.ts"/>


import THREE = require("three");
import jQuery = require("jquery");
//import OrbitControls = require("three-orbitcontrols");
import Stats = require("stats");
import Player = require("./player");
import World = require("./world");


// import Test = BallsOnline.Test;
class Scene {
	scene: THREE.Scene;
	camera: THREE.PerspectiveCamera;
	//cameraControls: THREE.OrbitControls;
	light: THREE.Light;
	renderer: THREE.WebGLRenderer;
	container: any;
	player: Player;
	world: World;
	stats: Stats;
	
	controls = {
		left: false,
		up: false,
		right: false,
		down: false
	};
	
	//controls: any;
	
	constructor() {
		console.log("starting scene init");
	
		this.container = jQuery('#test');
		// Create a scene, a camera, a light and a WebGL renderer with Three.JS
		this.scene = new THREE.Scene();
		
		//Setup camera
		//this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10000);
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 20000);
		this.camera.position.x = 0;
		this.camera.position.y = 50;
		this.camera.position.z = -70;		
		this.scene.add(this.camera);
		
		
		
				
		//Setup light
		this.light = new THREE.PointLight( 0xffffff, 1, 100 );
		this.light.position.set( -10, 20, 10 );
		//this.light.shadowDarkness = 0.5;
		//this.light.shadowCameraVisible = true;
		this.scene.add(this.light);
		
		this.light = new THREE.AmbientLight( 0x707070 ); // soft white light
		this.scene.add(this.light);
		
		//Setup renderer
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.shadowMapEnabled = true;
		this.renderer.shadowMapType = THREE.PCFSoftShadowMap;
		document.body.appendChild(this.renderer.domElement);
		
		
		// Define the container for the renderer
		//this.container = $('body');
		this.world = new World();
		this.scene.add(this.world.terrain);
		
		
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
		
		// Create the "world" : a 3D representation of the place we'll be putting our character in
		//this.world = new World({
		//	color: 0xF5F5F5
		//});
		
		//this.scene.add(this.world.mesh);
		// Define the size of the renderer
		//this.setAspect();
		// Insert the renderer in the container
		//this.container.prepend(this.renderer.domElement);
		// Set the camera to look at our user's character
		//this.setFocus(this.user.mesh);
		// Start the events handlers
		this.setControls();
		
		
		this.createSkybox();
		
		
		 
		//var stats = new Stats();
		//document.body.appendChild(Stats.domElement);	
		
		
		
		console.log(this.scene);
		console.log(this.camera);
		
		console.log("ending scene init");
	}
	
	createSkybox() {		
		var urlPrefix = "skybox/stormydays_";
			
		var urls = [ 	
			urlPrefix + "ft.jpg", urlPrefix + "bk.jpg",
			urlPrefix + "up.jpg", urlPrefix + "dn.jpg",
			urlPrefix + "rt.jpg", urlPrefix + "lf.jpg"	];
		
		var materialArray = [];
		for (var i = 0; i < 6; i++) {		
			materialArray.push( new THREE.MeshBasicMaterial({
				map: THREE.ImageUtils.loadTexture(urls[i]),
				side: THREE.BackSide
			}));
		}
		
		 var skyGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
		 var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
		 var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
		 this.scene.add(skyBox);
	}
	
	// Event handlers
	setControls() {
		console.log("setting controls");
		// Within jQuery's methods, we won't be able to access "this"
		//user 3w= this.user,
			// State of the different controls
		var player = this.player;
		var controls = this.controls;
		var basicScene = this;
		
		// When the user presses a key 
		jQuery(document).keydown(function (e) {
			var prevent = true;
			// Update the state of the attached control to "true"
			switch (e.keyCode) {
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
			} else {
				return;
			}
			// Update the character's direction
			//user.setDirection(controls);
		});
		// When the user releases a key
		jQuery(document).keyup(function (e) {
			var prevent = true;
			// Update the state of the attached control to "false"
			switch (e.keyCode) {
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
			} else {
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
	}
	
	// Defining the renderer's size
	setAspect() {
		console.log("setting aspect");
		// Fit the container's full width
		var w = this.container.width(),
			// Fit the initial visible area's height
			h = this.container.height();//jQuery(window).height() - this.container.offset().top - 20;
		// Update the renderer and the camera
		this.renderer.setSize(w, h);
		this.camera.aspect = w / h;
		this.camera.updateProjectionMatrix();
	}
	
	
	// Updating the camera to follow and look at a given Object3D / Mesh
	setFocus(object: THREE.Mesh) {
		this.camera.position.set(object.position.x, object.position.y + 128, object.position.z - 256);
		this.camera.lookAt(object.position);
	}
	
	// Update and draw the scene
	frame() {
		this.stats.update();
		
		var controls = this.controls;
		var player = this.player;
		
		console.log(controls);
		
		if (controls.left || controls.up || controls.right || controls.down) {
	
		if (controls.up)
			player.mesh.position.setZ(player.mesh.position.z + 1);
		if (controls.down)
			player.mesh.position.setZ(player.mesh.position.z - 1);
		if (controls.left)
			player.mesh.position.setX(player.mesh.position.x + 1);
		if (controls.right)
			player.mesh.position.setX(player.mesh.position.x - 1);
						
		//socket.emit('movement', {'guid': guid, 'position': player.mesh.position});
	}
		// Run a new step of the user's motions
		//this.user.motion();
		// Set the camera to look at our user's character
		//this.setFocus(this.world.terrain);
		this.setFocus(this.player.mesh);
		// And draw !
		this.renderer.render(this.scene, this.camera);
	}
}

//Export class
export = Scene;
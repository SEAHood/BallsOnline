///<reference path="../typings/threejs/three.d.ts"/>
///<reference path="../typings/physijs/physijs.d.ts"/>
//import three = require("three");
import PhysiJS = require("physijs");

class Player {
	guid: String;
	color: any; //This should be a number 
	username: String;
	mesh: PhysiJS.Mesh;
	controls: any;
	
	constructor(color: Object) { //find out what colour is	
	
		console.log("creating player");
		this.guid = this.generateGuid();
		this.color = this.generateColor();
		this.username = '1234';
		var friction = 1; // high friction
		var restitution = 1; // low restitution
		var material = PhysiJS.createMaterial(
			new THREE.MeshLambertMaterial({ color: this.color }),
			friction,
			restitution
		);
		
		//var mat = new THREE.MeshLambertMaterial({ color: this.color });
		
		//this.mesh = new THREE.Mesh(new THREE.SphereGeometry(5,32,32), new THREE.MeshLambertMaterial({ color: this.color }));
		this.mesh = new PhysiJS.SphereMesh(new THREE.SphereGeometry(5,32,32), material);
		this.mesh.castShadow = true;
		this.mesh.receiveShadow = true;
		this.mesh.position.x = 500;
		this.mesh.position.y = 1250;
		this.mesh.position.z = 0;
		// Enable CCD if the object moves more than 1 meter in one simulation frame
		this.mesh.setCcdMotionThreshold(1);

		// Set the radius of the embedded sphere such that it is smaller than the object
		this.mesh.setCcdSweptSphereRadius(4.5);
	}
	
	generateGuid() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
		}
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	}
	
	generateColor() {
		var letters = '0123456789ABCDEF'.split('');
		var color = '#';
		for (var i = 0; i < 6; i++ ) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}
	
	reset() {
		this.mesh.setLinearVelocity(new THREE.Vector3(0, 0, 0));
		this.mesh.setAngularVelocity(new THREE.Vector3(0, 0, 0));
		//this.mesh.set
		this.mesh.position.set(500, 1250, 0);
		this.mesh.__dirtyPosition = true;	
	}
}

//Export class
export = Player;
///<reference path="../typings/threejs/three.d.ts"/>
import three = require("three");

class Player {
	guid: String;
	color: any; //This should be a number 
	username: String;
	mesh: THREE.Mesh;
	controls: any;
	
	constructor(color: Object) { //find out what colour is	
	
		console.log("creating player");
		this.guid = this.generateGuid();
		this.color = this.generateColor();
		this.username = '1234';
		
		this.mesh = new THREE.Mesh(new THREE.SphereGeometry(5,32,32), new THREE.MeshLambertMaterial({ color: this.color }));
		this.mesh.castShadow = true;
		this.mesh.receiveShadow = true;
		this.mesh.position.x = 0;
		this.mesh.position.y = 10;
		this.mesh.position.z = 0;
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
}

//Export class
export = Player;
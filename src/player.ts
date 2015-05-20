///<reference path="../typings/threejs/three.d.ts"/>
import three = require("three");

class Player {
	guid: String;
	username: String;
	mesh: THREE.Mesh;
	controls: any;
	
	constructor(color: Object) { //find out what colour is	
	
		console.log("creating player");
		this.guid = '1234';
		this.username = '1234';
		
		this.mesh = new THREE.Mesh(new THREE.SphereGeometry(5,32,32), new THREE.MeshLambertMaterial({ color: 0xFFFFFF}));
		this.mesh.castShadow = true;
		this.mesh.receiveShadow = true;
		this.mesh.position.y = 10;
	}
}

//Export class
export = Player;
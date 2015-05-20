///<reference path="../typings/threejs/three.d.ts"/>
import three = require("three");

class Player {
	guid: String;
	username: String;
	model: THREE.Mesh;
	controls: any;
	
	constructor(color: Object) { //find out what colour is	
		this.guid = '1234';
		this.username = '1234';
		
		this.model = new THREE.Mesh(new THREE.SphereGeometry(5,32,32), new THREE.MeshLambertMaterial({ color: 0xFFFFFF}));
		this.model.castShadow = true;
		this.model.receiveShadow = true;
		this.model.position.y = 10;
	}
}

//Export class
export = Player;
///<reference path="../typings/threejs/three.d.ts"/>
import three = require("three");

class World {
	//username: String;
	terrain: THREE.Mesh;
	
	constructor() { //find out what colour is	
		var texture = THREE.ImageUtils.loadTexture( "metal2.jpg" );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		var terrainGeometry = new THREE.BoxGeometry(200, 10, 200);
		var terrainMaterial = new THREE.MeshLambertMaterial({ map: texture });
		this.terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
		//terrain.receiveShadow = true;
	}
}

//Export class
export = World;
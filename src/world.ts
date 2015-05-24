///<reference path="../typings/threejs/three.d.ts"/>
///<reference path="../typings/physijs/physijs.d.ts"/>
//import three = require("three");
import PhysiJS = require("physijs");

class World {
	//username: String;
	terrain: PhysiJS.BoxMesh;
	
	constructor() { //find out what colour is	
		var texture = THREE.ImageUtils.loadTexture( "metal2.jpg" );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		
		var friction = 1; // high friction
		var restitution = 1; // low restitution
		var terrainMaterial = PhysiJS.createMaterial(
			new THREE.MeshLambertMaterial({ map: texture }),
			friction,
			restitution
		);
		
		var terrainGeometry = new THREE.BoxGeometry(200, 10, 200);
		//var terrainMaterial = new THREE.MeshLambertMaterial({ map: texture });
		this.terrain = new PhysiJS.BoxMesh(terrainGeometry, terrainMaterial, 0);
		//terrain.receiveShadow = true;
	}
	
	addToScene(scene: PhysiJS.Scene) {
		scene.add(this.terrain);
	}
}

//Export class
export = World;

///<reference path="../typings/threejs/three.d.ts"/>
import url = require("three");

class Player {
    guid: string;
	mesh: THREE.Mesh;
	
    constructor(guid: string) {	
        this.guid = guid;
		this.mesh = new THREE.Mesh();
    }
}

var player1 = new Player('1234');
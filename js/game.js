var stats, scene, camera, renderer;
var container;
var cubes;
var terrain;
var testPlayer;
var otherPlayers = {};
var movement = false;
var user_movement = false;
var guid = generateGuid();

init();
animate();

function init() {
	container = document.createElement('div');
	document.body.appendChild(container);
	
	stats = new Stats();
	container.appendChild(stats.domElement);

	scene = new THREE.Scene();
	
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 20000);
	camera.position.x = 0;
	camera.position.y = 50;
	camera.position.z = 70;
	

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMapEnabled = true;
	renderer.shadowMapType = THREE.PCFSoftShadowMap;
	document.body.appendChild(renderer.domElement);
	
	
	controls = new THREE.OrbitControls( camera, renderer.domElement ); 
	controls.noPan = true;
	controls.addEventListener( 'change', render );

	
	/////SKYBOX
	var urlPrefix = "skybox/mercury_";
	// var urls = [ urlPrefix + "left.jpg", urlPrefix + "right.jpg",
		// urlPrefix + "top.jpg", urlPrefix + "lava.jpg",
		// urlPrefix + "front.jpg", urlPrefix + "back.jpg" ];
		
	var urls = [ 	
		urlPrefix + "ft.jpg", urlPrefix + "bk.jpg",
		urlPrefix + "up.jpg", urlPrefix + "dn.jpg",
		urlPrefix + "rt.jpg", urlPrefix + "lf.jpg"	];
	
	var materialArray = [];
	for (var i = 0; i < 6; i++)
	
		materialArray.push( new THREE.MeshBasicMaterial({
		map: THREE.ImageUtils.loadTexture( urls[i] ),
		side: THREE.BackSide
	}));
	
	 var skyGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
	 var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
	 var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
	 //skyBox.rotation.x += Math.PI / 2;
	 scene.add( skyBox );

	/////SKYBOX
	
	
	
	

	
	
	
	
	
	
	var texture = THREE.ImageUtils.loadTexture( "metal.jpg" );
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	var terrainGeometry = new THREE.BoxGeometry(200, 10, 200);
	var terrainMaterial = new THREE.MeshLambertMaterial({ map: texture });//color:'#ffffff', wireframe:false });
	terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
	terrain.receiveShadow = true;
	scene.add(terrain);
	
	var light = new THREE.PointLight( 0xffffff, 1, 100 );
	light.position.set( -10, 20, 10 );
	light.shadowDarkness = 0.5;
	light.shadowCameraVisible = true;
	scene.add( light );
	
	// var light = new THREE.PointLight( 0xff0000, 0.5, 100 );
	// light.position.set( 10, 20, -10 );
	// light.castShadow = true;
	// light.shadowDarkness = 1;
	// light.shadowCameraVisible = true;
	// scene.add( light );
	
	var light = new THREE.AmbientLight( 0x707070 ); // soft white light
	scene.add( light );
		
	var playerColor = getRandomColor();	
	testPlayer = new THREE.Mesh(new THREE.SphereGeometry(5,32,32), new THREE.MeshLambertMaterial({ color: playerColor}));
	testPlayer.castShadow = true;
	testPlayer.receiveShadow = true;
	testPlayer.position.y = 10;
	
	scene.add(testPlayer);
	
	
	
		
	// var theText = guid;

	// var text3d = new THREE.TextGeometry( theText, {
		// size: 5,
		// height: 20,
		// curveSegments: 2,
		// font: "helvetiker"
	// });

	// text3d.computeBoundingBox();
	// var centerOffset = -0.5 * ( text3d.boundingBox.max.x - text3d.boundingBox.min.x );

	// var textMaterial = new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff, overdraw: 0.5 } );
	// text = new THREE.Mesh( text3d, textMaterial );
}

function animate() {
	requestAnimationFrame( animate );
		
	if (controls.left || controls.up || controls.right || controls.down) {
	
		if (controls.up)
			testPlayer.position.setZ(testPlayer.position.z - 1);
		if (controls.down)
			testPlayer.position.setZ(testPlayer.position.z + 1);
		if (controls.left)
			testPlayer.position.setX(testPlayer.position.x - 1);
		if (controls.right)
			testPlayer.position.setX(testPlayer.position.x + 1);
						
		socket.emit('movement', {'guid': guid, 'position': testPlayer.position});
	}
	
	stats.update();
	
	render();
}

			
function render() {		
	renderer.render(scene, camera);
}

function getRandomColor() {
	var letters = '0123456789ABCDEF'.split('');
	var color = '#';
	for (var i = 0; i < 6; i++ ) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

function generateGuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}
			
// $(document).click( function(e) {
	// var target = $(e.target);
	// console.log(target);
	// if (!target.is('input')) {
		// if (movement)
			// movement = false;
		// else
			// movement = true;
			
		// event.preventDefault();
	// }
// });



socket.on('movement', function(player){
	if (player.guid != guid)
	{
		if (!(player.guid in otherPlayers)) {
			var color = getRandomColor();	
			otherPlayers[player.guid] = new THREE.Mesh(new THREE.SphereGeometry(5,32,32), new THREE.MeshLambertMaterial({ color: color}));
			console.log('test')
			otherPlayers[player.guid].position.set(player.position.x, player.position.y, player.position.z);
			scene.add(otherPlayers[player.guid]);
		} else {
			otherPlayers[player.guid].position.set(player.position.x, player.position.y, player.position.z);
		}
	}
});




var controls = 
{
	left: false,
	up: false,
	right: false,
	down: false
};
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
});

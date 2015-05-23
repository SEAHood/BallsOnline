import Scene = require("./scene");
import Chat = require("./chat");

console.log("invoking scene");
var scene = new Scene();

//Move to UI?
var chat = new Chat(scene.player.guid, scene.player.color);

function animate () {
	requestAnimationFrame(animate);
    scene.frame();
}
animate();
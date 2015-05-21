import Scene = require("./scene");
import Chat = require("./chat");

console.log("invoking scene");
var scene = new Scene();
var chat = new Chat();

function animate () {
	console.log(requestAnimationFrame);
    requestAnimationFrame(animate);
    scene.frame();
}
animate();
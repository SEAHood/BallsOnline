import Scene = require("./scene");

console.log("invoking scene");
var scene = new Scene();

function animate () {
	console.log(requestAnimationFrame);
    requestAnimationFrame(animate);
    scene.frame();
}
animate();
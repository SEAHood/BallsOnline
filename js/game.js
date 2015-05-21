define(["require", "exports", "./scene", "./chat"], function (require, exports, Scene, Chat) {
    console.log("invoking scene");
    var scene = new Scene();
    var chat = new Chat();
    function animate() {
        requestAnimationFrame(animate);
        scene.frame();
    }
    animate();
});

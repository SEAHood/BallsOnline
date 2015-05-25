define(["require", "exports", "./scene", "./chat"], function (require, exports, Scene, Chat) {
    var loadingManager = new THREE.LoadingManager(function () { console.log("done"); }, function (item, loaded, total) { console.log(total); }, function () { });
    // THREE.LoadingManager.onProgress = function ( item, loaded, total ) {
    // console.log( item, loaded, total );
    // };
    console.log("invoking scene");
    var scene = new Scene();
    //Move to UI?
    var chat = new Chat(scene.player.guid, scene.player.color);
    function animate() {
        requestAnimationFrame(animate);
        scene.frame();
    }
    animate();
});

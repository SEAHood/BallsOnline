define(["require", "exports", "./scene", "./chat", "./player-list"], function (require, exports, Scene, Chat, PlayerList) {
    var loadingManager = new THREE.LoadingManager(function () { console.log("done"); }, function (item, loaded, total) { console.log(total); }, function () { });
    // THREE.LoadingManager.onProgress = function ( item, loaded, total ) {
    // console.log( item, loaded, total );
    // };
    console.log("invoking scene");
    var scene = new Scene();
    //Move to UI?
    var chat = new Chat(scene.player.guid, scene.player.color);
    var playerList = new PlayerList();
    function animate() {
        requestAnimationFrame(animate);
        scene.frame();
    }
    animate();
});

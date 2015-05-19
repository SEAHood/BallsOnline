var Player = (function () {
    function Player(guid) {
        this.guid = guid;
        this.mesh = new THREE.Mesh();
    }
    return Player;
})();

var player1 = new Player('1234');

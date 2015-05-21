///<reference path="../typings/requirejs/require.d.ts"/>
requirejs.config({
    baseUrl: "src",
    paths: {
        "game": "../game",
        "scene": "../scene",
        "player": "../player",
        "world": "../world",
        "chat": "../chat",
        "socket.io": "../socket.io/socket.io",
        "sizzle": "/src/sizzle/dist/sizzle"
    },
    shim: {
        three: {
            exports: 'THREE'
        },
        'three-orbitcontrols': {
            exports: 'THREE.OrbitControls'
        },
        stats: {
            exports: 'Stats'
        },
        'socket.io': {
            exports: 'Socket'
        }
    }
});
require(["game"]);

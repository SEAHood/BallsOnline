///<reference path="../typings/requirejs/require.d.ts"/>
requirejs.config({
    baseUrl: "src",
    paths: {
        "game": "../game",
        "scene": "../scene",
        "player": "../player",
        "world": "../world",
        "network": "../network",
        "player-list": "../player-list",
        "chat": "../chat",
        "controls": "../controls",
        "socket.io": "../socket.io/socket.io",
        "sizzle": "/src/sizzle/dist/sizzle",
        "three-orbitcontrols": "three.orbitcontrols"
    },
    shim: {
        three: {
            exports: 'THREE'
        },
        stats: {
            exports: 'Stats'
        },
        'socket.io': {
            exports: 'Socket'
        },
        'physijs': {
            exports: 'Physijs'
        }
    },
    waitSeconds: 200
});
//Include three from the start
require(["three"], function (THREE) {
    require(["three-orbitcontrols"]);
    require(["game"]);
});

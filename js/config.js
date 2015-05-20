///<reference path="../typings/requirejs/require.d.ts"/>
requirejs.config({
    baseUrl: "src",
    paths: {
        "game": "../game",
        "scene": "../scene",
        "player": "../player",
        "three": "../three/three.min",
        "sizzle": "/src/sizzle/dist/sizzle"
    }
});
require(["game"]);

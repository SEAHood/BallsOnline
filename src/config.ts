///<reference path="../typings/requirejs/require.d.ts"/>

requirejs.config({
    baseUrl: '',
    paths: {
        "three": "/three/three.min",
        "jquery": "/jquery/jquery"
    }
});

require(["game"]);
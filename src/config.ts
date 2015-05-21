///<reference path="../typings/requirejs/require.d.ts"/>

requirejs.config({
    baseUrl: "src",
    paths: {
		"game": "../game",
		"scene": "../scene",
		"player": "../player",
		"world": "../world",
		"sizzle": "/src/sizzle/dist/sizzle"
    },
	shim: {
		three: {
			exports: 'THREE'
		}
	}
});

require(["game"]);
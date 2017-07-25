require.config({

	paths: {
		// require.js
		'require-lib':          'vendor/requirejs/require',
		'text':                 'vendor/requirejs-plugins/lib/text',
		'json':                 'vendor/requirejs-plugins/src/json',
		// vendor
		'jquery':               'vendor/jquery/dist/jquery',
		'underscore':           'vendor/underscore/underscore',
		'backbone':             'vendor/backbone/backbone',
		'handlebars':           'vendor/handlebars/handlebars.runtime',
		'TweenLite':            'vendor/greensock/src/uncompressed/TweenLite',
		'TweenMax':             'vendor/greensock/src/uncompressed/TweenMax',
		'TimelineLite':         'vendor/greensock/src/uncompressed/TimelineLite',
		'TimelineMax':          'vendor/greensock/src/uncompressed/TimelineMax',
		'three-lib':            'vendor/threejs/build/three',
		'three-gltf-loader':    'vendor/threejs/examples/js/loaders/GLTFLoader',
		'three-gltf2-loader':   'vendor/threejs/examples/js/loaders/GLTF2Loader',
		'three-obj-loader':     'vendor/threejs/examples/js/loaders/OBJLoader',
		'three-projector':      'vendor/threejs/examples/js/renderers/Projector',
		'promise-polyfill':     'vendor/promise-polyfill/promise',
		// plugins
		'backbone-util':        'plugin/backbone-util',
		'backbone-webgl':       'plugin/backbone-webgl',
		// directories
		'model':                'app/model',
		'util':                 'app/util',
		'view':                 'app/view',
		'webgl':                'app/webgl'
	},

	shim: {
		'three-gltf-loader': {
			deps: ['three', 'promise-polyfill'],
			exports: 'THREE.GLTFLoader'
		},
		'three-gltf2-loader': {
			deps: ['three', 'promise-polyfill'],
			exports: 'THREE.GLTF2Loader'
		},
		'three-obj-loader': {
			deps: ['three'],
			exports: 'THREE.OBJLoader'
		},
		'three-projector': {
			deps: ['three'],
			exports: 'THREE.Projector'
		}
	}
});

// Force THREE on the global scope so we can shim the three.js examples code
define('three', ['three-lib'], function (THREE) {
	window.THREE = THREE;
	return THREE;
});

require([
	'model/app-model',
	'app/app-fallback',
	'app/app-main'
], function (AppModel, AppFallback, AppMain) {

	AppModel.runFeatureTests();
	AppModel.get('testSuccess')
		? new AppMain()
		: new AppFallback();
});

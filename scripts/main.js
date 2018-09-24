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
		'TweenLite':            'vendor/gsap/src/uncompressed/TweenLite',
		'TweenMax':             'vendor/gsap/src/uncompressed/TweenMax',
		'TimelineLite':         'vendor/gsap/src/uncompressed/TimelineLite',
		'TimelineMax':          'vendor/gsap/src/uncompressed/TimelineMax',
		'three-lib':            'vendor/threejs/build/three',
		'three-gltf-loader':    'vendor/threejs/examples/js/loaders/GLTFLoader',
		'three-projector':      'vendor/threejs/examples/js/renderers/Projector',
		'promise-polyfill':     'vendor/promise-polyfill/dist/polyfill',
		// plugins
		'backbone-audio':       'plugin/backbone-audio',
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

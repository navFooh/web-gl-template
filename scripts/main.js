require.config({

	paths: {
		// require.js
		'requireLib':           'vendor/requirejs/require',
		'text':                 'vendor/requirejs-plugins/lib/text',
		'json':                 'vendor/requirejs-plugins/src/json',
		// vendor
		'jquery':               'vendor/jquery/dist/jquery',
		'underscore':           'vendor/underscore/underscore',
		'backbone':             'vendor/backbone/backbone',
		'backbone-super':       'vendor/backbone-super/backbone-super/backbone-super',
		'handlebars.runtime':   'vendor/handlebars/handlebars.runtime',
		'TweenLite':            'vendor/greensock/src/uncompressed/TweenLite',
		'TweenMax':             'vendor/greensock/src/uncompressed/TweenMax',
		'TimelineLite':         'vendor/greensock/src/uncompressed/TimelineLite',
		'TimelineMax':          'vendor/greensock/src/uncompressed/TimelineMax',
		'three':                'vendor/threejs/build/three',
		// plugins
		'three-OBJLoader':      'plugin/three-OBJLoader',
		'three-Projector':      'plugin/three-Projector',
		// directories
		'model':                'app/model',
		'view':                 'app/view',
		'templates':            '../templates/build'
	},

	shim: {
		'TimelineMax': { deps: ['TweenMax'] },
		'three': { exports: 'THREE' }
	}
});

require(['backbone-super'], function() {

	require(['app/App'], function(App) {
		App.initialize();
	});
});

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
		'handlebars':           'vendor/handlebars/handlebars.runtime',
		'TweenLite':            'vendor/greensock/src/uncompressed/TweenLite',
		'TweenMax':             'vendor/greensock/src/uncompressed/TweenMax',
		'TimelineLite':         'vendor/greensock/src/uncompressed/TimelineLite',
		'TimelineMax':          'vendor/greensock/src/uncompressed/TimelineMax',
		'three':                'vendor/threejs/build/three',
		// plugins
		'backbone-Object3D':    'plugin/backbone-Object3D',
		'three-CanvasRenderer': 'plugin/three-CanvasRenderer',
		'three-OBJLoader':      'plugin/three-OBJLoader',
		'three-Projector':      'plugin/three-Projector',
		// directories
		'model':                'app/model',
		'view':                 'app/view'
	}
});

require([
	'model/AppModel',
	'app/AppFallback',
	'app/AppMain'
], function(AppModel, AppFallback, AppMain) {

	AppModel.isSupported()
		? new AppMain()
		: new AppFallback();
});

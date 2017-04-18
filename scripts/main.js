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
		'backbone-util':        'plugin/backbone-util',
		'backbone-webgl':       'plugin/backbone-webgl',
		'three-obj-loader':     'plugin/three-obj-loader',
		'three-projector':      'plugin/three-projector',
		// directories
		'model':                'app/model',
		'util':                 'app/util',
		'view':                 'app/view',
		'webgl':                'app/webgl'
	}
});

require([
	'model/AppModel',
	'app/AppFallback',
	'app/AppMain'
], function (AppModel, AppFallback, AppMain) {

	AppModel.isSupported()
		? new AppMain()
		: new AppFallback();
});

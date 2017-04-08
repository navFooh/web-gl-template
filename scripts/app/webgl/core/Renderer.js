define([
	'backbone-WebGL',
	'model/DisplayModel',
	'model/WebGLModel',
	'three'
], function(WebGL, DisplayModel, WebGLModel, THREE) {

	return WebGL.extend({

		initialize: function (options) {

			this.renderer = new THREE.WebGLRenderer({
				canvas: options.canvas,
				alpha: false,
				antialias: false
			});

			this.renderer.autoClear = true;
			this.renderer.sortObjects = false;
			this.renderer.setClearColor(0x000000, 1);
			this.renderer.setPixelRatio(window.devicePixelRatio || 1);

			this.onResize();
			this.listenTo(DisplayModel, 'resize', this.onResize);
			this.listenTo(WebGLModel, 'render', this.render);
		},

		onResize: function() {
			var width = DisplayModel.get('width'),
				height = DisplayModel.get('height');
			this.renderer.setSize(width, height);
		},

		render: function(scene, camera) {
			this.renderer.render(scene, camera);
		}
	});
});

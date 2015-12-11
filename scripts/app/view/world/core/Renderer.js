define([
	'model/DisplayModel',
	'three'
], function(DisplayModel, THREE) {

	return Backbone.Object3D.extend({

		initialize: function () {
			this.renderer = new THREE.WebGLRenderer({
				alpha: false,
				antialias: false,
				maxLights: 4
			});
			this.renderer.autoClear = true;
			this.renderer.sortObjects = false;
			this.renderer.setClearColor(0x000000, 1);
			this.onResize();

			this.listenTo(DisplayModel, 'resize', this.onResize);
		},

		onResize: function() {
			var width = DisplayModel.get('width'),
				height = DisplayModel.get('height');
			this.renderer.setSize(width, height);
		}
	});
});

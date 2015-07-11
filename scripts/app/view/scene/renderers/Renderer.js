define([
	'model/DisplayModel',
	'model/SceneModel',
	'three'
], function(DisplayModel, SceneModel, THREE) {

	return Backbone.View.extend({

		renderer: null,

		initialize: function (options) {
			this.createRenderer(options.$parent);
		},

		createRenderer: function($parent) {
			this.renderer = new THREE.WebGLRenderer({
				alpha: false,
				antialias: false,
				maxLights: 4
			});
			this.renderer.autoClear = true;
			this.renderer.sortObjects = false;
			this.renderer.setClearColor(0x000000, 1);

			this.setElement(this.renderer.domElement);
			this.$el.appendTo($parent);
			this.onResize();

			this.listenTo(DisplayModel, 'resize', this.onResize);
		},

		onResize: function() {
			this.renderer.setSize(DisplayModel.get('width'), DisplayModel.get('height'));
		},

		render: function() {
			this.renderer.render(SceneModel.get('scene'), SceneModel.get('camera'));
		}
	});
});

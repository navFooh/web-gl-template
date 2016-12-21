define([
	'model/WorldModel',
	'model/StateModel',
	'webgl/core/Scene',
	'webgl/core/Camera',
	'webgl/core/Renderer'
], function(WorldModel, StateModel, Scene, Camera, Renderer) {

	return Backbone.View.extend({

		render: function($parent) {
			StateModel.startLoading();
			WorldModel.listenToOnce(StateModel, 'change:loading', WorldModel.run);

			var scene = new Scene().scene,
				camera = new Camera().camera,
				renderer = new Renderer().renderer;

			WorldModel.set({
				scene: scene,
				camera: camera,
				renderer: renderer
			});

			this.setElement(renderer.domElement);
			this.$el.appendTo($parent);
		}
	});
});

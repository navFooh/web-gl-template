define([
	'model/SceneModel',
	'model/StateModel',
	'view/scene/renderers/Renderer',
	'view/scene/cameras/Camera',
	'view/scene/lights/AmbientLight',
	'view/scene/lights/PointLight',
	'view/scene/objects/Thing',
	'three'
], function(SceneModel, StateModel, Renderer, Camera, AmbientLight, PointLight, Thing, THREE) {

	return Backbone.View.extend({

		renderer: null,
		clock: null,

		initialize: function (options) {
			_.bindAll(this, 'loop');

			StateModel.startLoading();
			SceneModel.set({ scene: new THREE.Scene() });

			this.renderer = new Renderer(options);
			this.clock = new THREE.Clock();

			new Camera();
			new AmbientLight();
			new PointLight();
			new Thing();

			this.listenToOnce(StateModel, 'loader:finished', this.loop);
		},

		loop: function() {
			requestAnimationFrame(this.loop, this.renderer.el);

			SceneModel.set({
				delta: Math.min(0.1, this.clock.getDelta()),
				elapsed: this.clock.elapsedTime
			});

			this.renderer.render();
		}
	});
});

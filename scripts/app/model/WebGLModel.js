define([
	'backbone',
	'three'
], function (Backbone, THREE) {

	var clock = new THREE.Clock(false),
		requestId = null,
		WebGLModel = Backbone.Model.extend({

			defaults: {
				scene: null,
				camera: null,
				renderer: null
			},

			initialize: function() {
				_.bindAll(this, 'update');
			},

			start: function() {
				if (requestId) return;
				clock.start();
				this.update();
			},

			stop: function() {
				if (!requestId) return;
				cancelAnimationFrame(requestId);
				requestId = null;
				clock.stop();
			},

			update: function() {
				requestId = requestAnimationFrame(this.update);
				var delta = clock.getDelta(),
					elapsed = clock.elapsedTime;
				this.trigger('update', delta, elapsed);
				this.render();
			},

			render: function() {
				var scene = this.get('scene').getScene(),
					camera = this.get('camera').getCamera(),
					renderer = this.get('renderer').getRenderer();
				renderer.render(scene, camera);
			}
		});

	return new WebGLModel();
});

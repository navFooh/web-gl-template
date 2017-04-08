define([
	'backbone',
	'three'
], function (Backbone, THREE) {

	var clock = new THREE.Clock(false),
		requestId = null,
		WebGLModel = Backbone.Model.extend({

			defaults: {
				scene: null,
				camera: null
			},

			initialize: function() {
				this.loop = this.loop.bind(this);
			},

			start: function() {
				if (requestId) return;
				clock.start();
				this.loop();
			},

			stop: function() {
				if (!requestId) return;
				cancelAnimationFrame(requestId);
				requestId = null;
				clock.stop();
			},

			loop: function() {
				requestId = requestAnimationFrame(this.loop);
				var delta = clock.getDelta(),
					elapsed = clock.elapsedTime;
				this.trigger('update', delta, elapsed);
				this.trigger('render');
			}
		});

	return new WebGLModel();
});

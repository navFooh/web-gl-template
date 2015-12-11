define(['three'], function (THREE) {

	var clock = new THREE.Clock(),
		requestId = null,
		WorldModel = Backbone.Model.extend({

			defaults: {
				scene: null,
				camera: null,
				renderer: null
			},

			initialize: function() {
				_.bindAll(this, 'update');
			},

			run: function() {
				if (requestId) return;
				this.update();
			},

			stop: function() {
				if (!requestId) return;
				cancelAnimationFrame(requestId);
				requestId = null;
			},

			update: function() {
				requestId = requestAnimationFrame(this.update, document.body);
				var delta = Math.min(0.1, clock.getDelta()),
					elapsed = clock.elapsedTime;
				this.trigger('update', delta, elapsed);
				this.render();
			},

			render: function() {
				var scene = this.get('scene'),
					camera = this.get('camera'),
					renderer = this.get('renderer');
				renderer.render(scene, camera);
			}
		});

	return new WorldModel();
});

define([
	'backbone-WebGL',
	'model/WebGLModel',
	'three'
], function(WebGL, WebGLModel, THREE) {

	return WebGL.extend({

		initialize: function () {

			this.angle = 0;
			this.light = new THREE.PointLight(0x0000ff, 1, 500);
			this.parent.add(this.light);

			this.listenTo(WebGLModel, 'update', this.update);
		},

		update: function (delta, elapsed) {
			this.angle += delta * 2;
			this.angle %= Math.PI * 2;
			this.light.position.x = 250 * Math.cos(this.angle);
			this.light.position.z = 250 * Math.sin(this.angle);
		}
	});
});

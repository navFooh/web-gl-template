define([
	'model/WorldModel',
	'three'
], function(WorldModel, THREE) {

	return Backbone.Object3D.extend({

		initialize: function () {
			this.light = new THREE.PointLight(0x0000ff, 1, 500);
			this.scene.add(this.light);

			this.angle = 0;

			this.listenTo(WorldModel, 'update', this.update);
		},

		update: function (delta, elapsed) {
			this.angle += delta * 2;
			this.angle %= Math.PI * 2;
			this.light.position.x = 250 * Math.cos(this.angle);
			this.light.position.z = 250 * Math.sin(this.angle);
		}
	});
});

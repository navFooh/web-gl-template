define([
	'model/SceneModel',
	'three'
], function(SceneModel, THREE) {

	return Backbone.View.extend({

		light: null,
		angle: 0,

		initialize: function () {
			this.createLight();
			this.listenTo(SceneModel, 'change:elapsed', this.update);
		},

		createLight: function () {
			this.light = new THREE.PointLight(0x0000ff, 1, 500);
			SceneModel.get('scene').add(this.light);
		},

		update: function () {
			var delta = SceneModel.get('delta');
			this.angle += delta * 2;
			this.angle %= Math.PI * 2;
			this.light.position.x = 250 * Math.cos(this.angle);
			this.light.position.z = 250 * Math.sin(this.angle);
		}
	});
});
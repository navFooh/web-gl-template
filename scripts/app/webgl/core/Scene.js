define([
	'webgl/lights/AmbientLight',
	'webgl/lights/PointLight',
	'webgl/objects/Thing'
], function(AmbientLight, PointLight, Thing) {

	return Backbone.Object3D.extend({

		initialize: function () {
			this.scene = new THREE.Scene();
			new AmbientLight({ scene: this.scene });
			new PointLight({ scene: this.scene });
			new Thing({ scene: this.scene });
		}
	});
});

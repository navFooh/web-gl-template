define([
	'view/world/lights/AmbientLight',
	'view/world/lights/PointLight',
	'view/world/objects/Thing'
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

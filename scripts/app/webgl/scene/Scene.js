define([
	'backbone-WebGL',
	'webgl/lights/AmbientLight',
	'webgl/lights/PointLight',
	'webgl/objects/Thing'
], function(WebGL, AmbientLight, PointLight, Thing) {

	return WebGL.extend({

		initialize: function () {

			this.scene = new THREE.Scene();

			new AmbientLight({ parent: this.scene });
			new PointLight({ parent: this.scene });
			new Thing({ parent: this.scene });
		},

		getScene: function() {
			return this.scene;
		}
	});
});

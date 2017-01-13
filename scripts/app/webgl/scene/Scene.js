define([
	'backbone-WebGL',
	'webgl/light/Ambient',
	'webgl/light/Directional',
	'webgl/object/Thing',
	'three'
], function(WebGL, Ambient, Directional, Thing, THREE) {

	return WebGL.extend({

		initialize: function () {

			this.scene = new THREE.Scene();

			new Ambient({ parent: this.scene });
			new Directional({ parent: this.scene });
			new Thing({ parent: this.scene });
		},

		getScene: function() {
			return this.scene;
		}
	});
});

define([
	'backbone-WebGL',
	'three',
	'webgl/light/Ambient',
	'webgl/light/Directional',
	'webgl/object/Thing'
], function (WebGL, THREE, Ambient, Directional, Thing) {

	return WebGL.extend({

		initialize: function () {

			this.scene = new THREE.Scene();

			new Ambient({ parent: this.scene });
			new Directional({ parent: this.scene });
			new Thing({ parent: this.scene });
		}
	});
});

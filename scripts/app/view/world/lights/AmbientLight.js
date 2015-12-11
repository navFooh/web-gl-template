define(['three'], function(THREE) {

	return Backbone.Object3D.extend({

		initialize: function () {
			this.light = new THREE.AmbientLight(0x404040);
			this.scene.add(this.light);
		}
	});
});

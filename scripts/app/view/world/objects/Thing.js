define([
	'model/WorldModel',
	'util/Loader',
	'three'
], function(WorldModel, Loader, THREE) {

	return Backbone.Object3D.extend({

		initialize: function () {
			_.bindAll(this, 'onLoadTexture');
			Loader.loadTexture('assets/images/og-image.jpg', this.onLoadTexture);
		},

		onLoadTexture: function(texture) {
			this.createMesh(texture);
			this.listenTo(WorldModel, 'update', this.update);
		},

		createMesh: function(texture) {
			this.mesh = new THREE.Mesh(
				new THREE.BoxGeometry(100, 100, 100),
				new THREE.MeshLambertMaterial({ map: texture })
			);
			this.mesh.rotation.x = Math.PI * 0.125;
			this.scene.add(this.mesh);
		},

		update: function (delta, elapsed) {
			this.mesh.rotation.y += 0.5 * delta;
			this.mesh.rotation.y %= Math.PI * 2;
		}
	});
});

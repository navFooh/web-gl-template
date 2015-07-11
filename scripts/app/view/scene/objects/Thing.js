define([
	'model/SceneModel',
	'util/Loader',
	'three'
], function(SceneModel, Loader, THREE) {

	return Backbone.View.extend({

		mesh: null,

		initialize: function () {
			this.createMesh();
			this.listenTo(SceneModel, 'change:elapsed', this.update);
		},

		createMesh: function () {
			this.mesh = new THREE.Mesh(
				new THREE.BoxGeometry(100, 100, 100),
				new THREE.MeshLambertMaterial({
					map: Loader.loadTexture('assets/images/og-image.jpg')
				})
			);
			this.mesh.rotation.x = Math.PI * 0.125;
			SceneModel.get('scene').add(this.mesh);
		},

		update: function () {
			var delta = SceneModel.get('delta');
			this.mesh.rotation.y += 0.5 * delta;
			this.mesh.rotation.y %= Math.PI * 2;
		}
	});
});

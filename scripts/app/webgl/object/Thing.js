define([
	'backbone-WebGL',
	'model/AssetModel',
	'model/WebGLModel',
	'three'
], function(WebGL, AssetModel, WebGLModel, THREE) {

	return WebGL.extend({

		initialize: function () {
			AssetModel.load(AssetModel.TEXTURE, 'assets/images/og-image.jpg', this.onLoad);
		},

		onLoad: function(texture) {

			this.mesh = new THREE.Mesh(
				new THREE.BoxGeometry(100, 100, 100),
				new THREE.MeshLambertMaterial({ map: texture })
			);
			this.mesh.rotation.x = Math.PI * 0.125;
			this.parent.add(this.mesh);

			this.listenTo(WebGLModel, 'update', this.update);
		},

		update: function (delta, elapsed) {
			this.mesh.rotation.y += 0.5 * delta;
			this.mesh.rotation.y %= Math.PI * 2;
		}
	});
});

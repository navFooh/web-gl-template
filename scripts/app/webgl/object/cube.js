define([
	'backbone-webgl',
	'three',
	'model/asset-model'
], function (WebGL, THREE, AssetModel) {

	return WebGL.extend({

		initialize: function () {
			AssetModel.load(AssetModel.TEXTURE, 'img/og-image.jpg', this.onLoad.bind(this));
		},

		onLoad: function (texture) {
			this.parent.add(new THREE.Mesh(
				new THREE.BoxGeometry(100, 100, 100),
				new THREE.MeshLambertMaterial({ map: texture })
			));
		}
	});
});

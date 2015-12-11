define([
	'model/DisplayModel',
	'model/WorldModel',
	'three'
], function(DisplayModel, WorldModel, THREE) {

	return Backbone.Object3D.extend({

		initialize: function () {
			var aspect = DisplayModel.get('aspect');

			this.camera = new THREE.PerspectiveCamera(35, aspect, 1, 1000);
			this.camera.position.set(0, 0, 500);

			this.listenTo(DisplayModel, 'resize', this.onResize);
			this.listenTo(WorldModel, 'update', this.update);
		},

		onResize: function() {
			this.camera.aspect = DisplayModel.get('aspect');
			this.camera.updateProjectionMatrix();
		},

		update: function(delta, elapsed) {
			this.camera.lookAt(new THREE.Vector3(0, 0, 0));
		}
	});
});

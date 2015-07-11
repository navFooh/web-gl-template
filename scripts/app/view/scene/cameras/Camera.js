define([
	'model/DisplayModel',
	'model/SceneModel',
	'three'
], function(DisplayModel, SceneModel, THREE) {

	return Backbone.View.extend({

		camera: null,

		initialize: function () {
			this.createCamera();
		},

		createCamera: function() {
			var aspect = DisplayModel.get('width') / DisplayModel.get('height');

			this.camera = new THREE.PerspectiveCamera(35, aspect, 1, 1000);
			this.camera.position.set(0, 0, 500);
			this.camera.lookAt(SceneModel.get('scene').position);

			SceneModel.set({ camera: this.camera });

			this.listenTo(DisplayModel, 'resize', this.onResize);
		},

		onResize: function() {
			this.camera.aspect = DisplayModel.get('width') / DisplayModel.get('height');
			this.camera.updateProjectionMatrix();
		}
	});
});

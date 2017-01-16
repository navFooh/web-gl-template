define([
	'backbone-WebGL',
	'model/DisplayModel',
	'util/OrbitControl',
	'three'
], function(WebGL, DisplayModel, OrbitControl, THREE) {

	return WebGL.extend({

		initialize: function () {
			var aspect = DisplayModel.get('aspect');

			this.camera = new THREE.PerspectiveCamera(35, aspect, 1, 1000);
			this.camera.position.set(0, 0, 500);
			this.camera.lookAt(new THREE.Vector3(0, 0, 0));

			this.control = new OrbitControl(this.camera);
			this.control.start();

			this.listenTo(DisplayModel, 'resize', this.onResize);
		},

		onResize: function() {
			this.camera.aspect = DisplayModel.get('aspect');
			this.camera.updateProjectionMatrix();
		},

		getCamera: function() {
			return this.camera;
		}
	});
});

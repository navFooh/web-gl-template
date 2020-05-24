define([
	'backbone-webgl',
	'three',
	'model/display-model',
	'util/orbit-control'
], function (WebGL, THREE, DisplayModel, OrbitControl) {

	var FIT_MODES = {
		CONTAIN: 0,
		COVER: 1
	};

	return WebGL.extend({

		near: 1,
		far: 5000,

		defaultFOV: 50,

		fitWidth: null,
		fitHeight: null,
		fitDepth: null,
		fitMode: null,

		initialize: function () {
			var fov = this.getFOV();
			var aspect = DisplayModel.get('aspect');
			var target = new THREE.Vector3(0, 0, 0);

			this.camera = new THREE.PerspectiveCamera(fov, aspect, this.near, this.far);
			this.camera.position.set(0, 0, 500);
			this.camera.lookAt(target);

			this.control = new OrbitControl(this.camera, target);

			this.listenTo(DisplayModel, 'resize', this.onResize);
		},

		onResize: function () {
			this.camera.fov = this.getFOV();
			this.camera.aspect = DisplayModel.get('aspect');
			this.camera.updateProjectionMatrix();
		},

		getFOV: function () {
			var aspect = DisplayModel.get('aspect');
			var widthFOV = this.fitDepth && this.fitWidth ? 360 * Math.atan(this.fitWidth / aspect / (2 * this.fitDepth)) / Math.PI : null;
			var heightFOV = this.fitDepth && this.fitHeight ? 360 * Math.atan(this.fitHeight / (2 * this.fitDepth)) / Math.PI : null;

			if (widthFOV && heightFOV) {
				switch (this.fitMode) {
					case FIT_MODES.CONTAIN:
						return Math.max(widthFOV, heightFOV);
					case FIT_MODES.COVER:
						return Math.min(widthFOV, heightFOV);
				}
			}

			return widthFOV || heightFOV || this.defaultFOV;
		}
	});
});

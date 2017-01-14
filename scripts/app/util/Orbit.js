define(['three'], function (THREE) {

	return function (object, target) {

		this.target = target || new THREE.Vector3();
		this.enableDamping = false;
		this.dampingFactor = 0.25;
		this.minDistance = 0;
		this.maxDistance = Infinity;
		this.minPolarAngle = 0;
		this.maxPolarAngle = Math.PI;
		this.minAzimuthAngle = -Infinity;
		this.maxAzimuthAngle = Infinity;

		var scale = 1;
		var spherical = new THREE.Spherical();
		var sphericalDelta = new THREE.Spherical();

		var offset = new THREE.Vector3();

		// so camera.up is the orbit axis
		var quat = new THREE.Quaternion().setFromUnitVectors(object.up, new THREE.Vector3(0, 1, 0));
		var quatInverse = quat.clone().inverse();

		this.getPolarAngle = function () {
			return spherical.phi;
		};

		this.getAzimuthalAngle = function () {
			return spherical.theta;
		};

		this.dollyIn = function (dollyScale) {
			scale /= dollyScale;
		};

		this.dollyOut = function (dollyScale) {
			scale *= dollyScale;
		};

		this.rotateLeft = function (angle) {
			sphericalDelta.theta -= angle;
		};

		this.rotateUp = function (angle) {
			sphericalDelta.phi -= angle;
		};

		this.update = function () {
			offset.copy(object.position).sub(this.target);

			// rotate offset to "y-axis-is-up" space
			offset.applyQuaternion(quat);

			spherical.setFromVector3(offset);
			spherical.theta += sphericalDelta.theta;
			spherical.theta = Math.max(this.minAzimuthAngle, Math.min(this.maxAzimuthAngle, spherical.theta));
			spherical.phi += sphericalDelta.phi;
			spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, spherical.phi));
			spherical.makeSafe();
			spherical.radius *= scale;
			spherical.radius = Math.max(this.minDistance, Math.min(this.maxDistance, spherical.radius));

			offset.setFromSpherical(spherical);

			// rotate offset back to "camera-up-vector-is-up" space
			offset.applyQuaternion(quatInverse);

			object.position.copy(this.target).add(offset);
			object.lookAt(this.target);

			if (this.enableDamping === true) {
				sphericalDelta.theta *= (1 - this.dampingFactor);
				sphericalDelta.phi *= (1 - this.dampingFactor);
			} else {
				sphericalDelta.set(0, 0, 0);
			}

			scale = 1;
		};
	};
});

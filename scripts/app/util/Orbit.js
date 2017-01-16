define(['three'], function (THREE) {

	return function (object, target) {

		target = target || new THREE.Vector3();

		this.minDistance = 0;
		this.maxDistance = Infinity;
		this.minPolarAngle = 0;
		this.maxPolarAngle = Math.PI;
		this.minAzimuthAngle = -Infinity;
		this.maxAzimuthAngle = Infinity;

		var scale = 1;
		var offset = new THREE.Vector3();
		var spherical = new THREE.Spherical();
		var sphericalDelta = new THREE.Spherical();

		// object.up is the orbit axis
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
			this.update();
		};

		this.dollyOut = function (dollyScale) {
			scale *= dollyScale;
			this.update();
		};

		this.rotateLeft = function (angle) {
			sphericalDelta.theta -= angle;
			this.update();
		};

		this.rotateUp = function (angle) {
			sphericalDelta.phi -= angle;
			this.update();
		};

		this.update = function () {
			offset.copy(object.position).sub(target);
			offset.applyQuaternion(quat);

			spherical.setFromVector3(offset);
			spherical.theta += sphericalDelta.theta;
			spherical.theta = Math.max(this.minAzimuthAngle, Math.min(this.maxAzimuthAngle, spherical.theta));
			spherical.phi += sphericalDelta.phi;
			spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, spherical.phi));
			spherical.radius *= scale;
			spherical.radius = Math.max(this.minDistance, Math.min(this.maxDistance, spherical.radius));
			spherical.makeSafe();

			offset.setFromSpherical(spherical);
			offset.applyQuaternion(quatInverse);

			object.position.copy(target).add(offset);
			object.lookAt(target);

			sphericalDelta.set(0, 0, 0);
			scale = 1;
		};
	};
});

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
		var panOffset = new THREE.Vector3();
		var spherical = new THREE.Spherical();
		var sphericalDelta = new THREE.Spherical();

		this.getPolarAngle = function () {
			return spherical.phi;
		};

		this.getAzimuthalAngle = function () {
			return spherical.theta;
		};

		this.panLeft = function () {
			var v = new THREE.Vector3();
			return function panLeft(distance, objectMatrix) {
				v.setFromMatrixColumn(objectMatrix, 0); // get X column of objectMatrix
				v.multiplyScalar(-distance);
				panOffset.add(v);
			};
		}();

		this.panUp = function () {
			var v = new THREE.Vector3();
			return function panUp(distance, objectMatrix) {
				v.setFromMatrixColumn(objectMatrix, 1); // get Y column of objectMatrix
				v.multiplyScalar(distance);
				panOffset.add(v);
			};
		}();

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

		this.update = function (scope) {

			var offset = new THREE.Vector3();

			// so camera.up is the orbit axis
			var quat = new THREE.Quaternion().setFromUnitVectors(object.up, new THREE.Vector3(0, 1, 0));
			var quatInverse = quat.clone().inverse();

			return function update() {

				var position = object.position;
				offset.copy(position).sub(scope.target);

				// rotate offset to "y-axis-is-up" space
				offset.applyQuaternion(quat);

				spherical.setFromVector3(offset);
				spherical.theta += sphericalDelta.theta;
				spherical.theta = Math.max(scope.minAzimuthAngle, Math.min(scope.maxAzimuthAngle, spherical.theta));
				spherical.phi += sphericalDelta.phi;
				spherical.phi = Math.max(scope.minPolarAngle, Math.min(scope.maxPolarAngle, spherical.phi));
				spherical.makeSafe();
				spherical.radius *= scale;
				spherical.radius = Math.max(scope.minDistance, Math.min(scope.maxDistance, spherical.radius));

				scope.target.add(panOffset);

				offset.setFromSpherical(spherical);

				// rotate offset back to "camera-up-vector-is-up" space
				offset.applyQuaternion(quatInverse);

				position.copy(scope.target).add(offset);
				object.lookAt(scope.target);

				if (scope.enableDamping === true) {
					sphericalDelta.theta *= (1 - scope.dampingFactor);
					sphericalDelta.phi *= (1 - scope.dampingFactor);
				} else {
					sphericalDelta.set(0, 0, 0);
				}

				scale = 1;
				panOffset.set(0, 0, 0);
			};
		}(this);
	};
});

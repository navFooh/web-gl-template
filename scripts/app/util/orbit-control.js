define([
	'backbone',
	'underscore',
	'model/display-model',
	'model/pointer-model',
	'model/webgl-model',
	'util/orbit'
], function (Backbone, _, DisplayModel, PointerModel, WebGLModel, Orbit) {

	var OrbitControl = function (object, target, options) {

		_.extend(this, {
			button: 0,
			enableZoom: true,
			zoomSpeed: 1,
			enableRotate: true,
			rotateSpeed: 1,
			rotatePanX: 0,
			rotatePanZ: 0,
			startTheta: 0,
			startPhi: Math.PI * 0.5,
			minDistance: 0,
			maxDistance: Infinity,
			minTheta: -Infinity,
			maxTheta: Infinity,
			minPhi: 0,
			maxPhi: Math.PI,
			edgeSlackTheta: 0.25 * Math.PI,
			edgeSlackPhi: 0.1 * Math.PI,
			edgePushBack: 25,
			naturalDamping: 5
		}, options);

		this.orbit = new Orbit(object, target);

		this._initialize();
	};

	_.extend(OrbitControl.prototype, Backbone.Events, {

		_initialize: function () {
			this._pointerDown = false;
			this._pointerMoveTime = 0;
			this._pointerMoveTheta = 0;
			this._pointerMovePhi = 0;
			this._velocityTheta = 0;
			this._velocityPhi = 0;
			this._startTargetX = this.orbit.target.x;
			this._startTargetZ = this.orbit.target.z;

			this.orbit.spherical.theta = this.startTheta;
			this.orbit.spherical.phi = this.startPhi;
			this.updateRotation();

			this.enableRotate && this.listenTo(PointerModel, PointerModel.EVENT.DOWN, this.onPointerDown);
			this.enableZoom && this.listenTo(PointerModel, PointerModel.EVENT.WHEEL, this.onMouseWheel);
			this.enableZoom && this.listenTo(PointerModel, PointerModel.EVENT.PINCH_START, this.onPinchStart);

			this.listenTo(WebGLModel, 'update', this.update);
		},

		onPointerDown: function (event) {
			if (event.button != this.button) return;
			this._pointerDown = true;
			this._pointerMoveTime = WebGLModel.getElapsedTime();
			this._pointerMoveTheta = 0;
			this._pointerMovePhi = 0;
			this.listenTo(PointerModel, PointerModel.EVENT.MOVE, this.onPointerMove);
			this.listenTo(PointerModel, PointerModel.EVENT.UP, this.onPointerUp);
		},

		onPointerMove: function (event) {
			var aspect = DisplayModel.get('aspect'),
				deltaX = (aspect > 1 ? event.normalDeltaX : event.normalDeltaX * aspect),
				deltaY = (aspect > 1 ? event.normalDeltaY / aspect : event.normalDeltaY),
				edgeDistTheta = this.getEdgeDistance(this.orbit.spherical.theta, this.minTheta, this.maxTheta),
				edgeDistPhi = this.getEdgeDistance(this.orbit.spherical.phi, this.minPhi, this.maxPhi),
				edgeFactorX = Math.max(0, 1 - edgeDistTheta / this.edgeSlackTheta),
				edgeFactorY = Math.max(0, 1 - edgeDistPhi / this.edgeSlackPhi),
				deltaTheta = this.rotateSpeed * this.planarToRadial(deltaX) * edgeFactorX,
				deltaPhi = this.rotateSpeed * this.planarToRadial(deltaY) * edgeFactorY,
				currentTime = WebGLModel.getElapsedTime(),
				deltaTime = currentTime - this._pointerMoveTime;
			this._pointerMoveTime = currentTime;
			this._pointerMoveTheta += deltaTheta;
			this._pointerMovePhi += deltaPhi;
			if (deltaTime > 0) {
				this._velocityTheta = this._pointerMoveTheta / deltaTime;
				this._velocityPhi = this._pointerMovePhi / deltaTime;
				this._pointerMoveTheta = 0;
				this._pointerMovePhi = 0;
			}
			this.orbit.spherical.theta += deltaTheta;
			this.orbit.spherical.phi += deltaPhi;
			this.updateRotation();
		},

		onPointerUp: function (event) {
			if (event.button != this.button) return;
			this._pointerDown = false;
			this.stopListening(PointerModel, PointerModel.EVENT.MOVE);
			this.stopListening(PointerModel, PointerModel.EVENT.UP);
		},

		onMouseWheel: function (event) {
			var scale = Math.pow(0.95, this.zoomSpeed * Math.abs(event.deltaY));
			this.setRadius(event.deltaY > 0
				? this.orbit.spherical.radius * scale
				: this.orbit.spherical.radius / scale);
		},

		onPinchStart: function () {
			this._pinchStartRadius = this.orbit.spherical.radius;
			this.stopListening(PointerModel, PointerModel.EVENT.WHEEL);
			this.listenTo(PointerModel, PointerModel.EVENT.PINCH_MOVE, this.onPinchMove);
			this.listenTo(PointerModel, PointerModel.EVENT.PINCH_END, this.onPinchEnd);
		},

		onPinchMove: function (event) {
			this.setRadius(this._pinchStartRadius / event.scale);
		},

		onPinchEnd: function () {
			this.stopListening(PointerModel, PointerModel.EVENT.PINCH_MOVE);
			this.stopListening(PointerModel, PointerModel.EVENT.PINCH_END);
			this.listenTo(PointerModel, PointerModel.EVENT.WHEEL, this.onMouseWheel);
		},

		updateRotation: function () {
			this.orbit.spherical.makeSafe();

			if (this.rotatePanX)
				this.orbit.target.x = this._startTargetX + this.rotatePanX * Math.sin(this.orbit.spherical.theta);

			if (this.rotatePanZ)
				this.orbit.target.z = this._startTargetZ - this.rotatePanZ * (1 - Math.sin(this.orbit.spherical.phi));

			this.orbit.update();
		},

		setRadius: function (radius) {
			this.orbit.spherical.radius = Math.max(this.minDistance, Math.min(this.maxDistance, radius));
			this.orbit.update();
		},

		update: function (delta) {
			if (!this._pointerDown) {
				// Apply edge push-back
				var edgePushBackTheta = this.getEdgePushBack(this.orbit.spherical.theta, this.minTheta, this.maxTheta),
					edgePushBackPhi = this.getEdgePushBack(this.orbit.spherical.phi, this.minPhi, this.maxPhi);
				this._velocityTheta += delta * edgePushBackTheta * this.edgePushBack;
				this._velocityPhi += delta * edgePushBackPhi * this.edgePushBack;

				// Set velocity-based rotation
				this.orbit.spherical.theta += this._velocityTheta * delta;
				this.orbit.spherical.phi += this._velocityPhi * delta;
				this.updateRotation();

				// Apply natural damping
				this._velocityTheta -= Math.min(delta * this.naturalDamping, 1) * this._velocityTheta;
				this._velocityPhi -= Math.min(delta * this.naturalDamping, 1) * this._velocityPhi;
			}
		},

		planarToRadial: function (value) {
			return -2 * Math.PI * value;
		},

		getEdgeDistance: function (angle, min, max) {
			return Math.max(Math.max(min - angle, angle - max), 0);
		},

		getEdgePushBack: function (angle, min, max) {
			return angle < min ? 1 : angle > max ? -1 : 0;
		}
	});

	return OrbitControl;
});

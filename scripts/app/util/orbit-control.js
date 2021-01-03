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
			cinematic: false,
			cinematicSpeed: 1,
			button: 0,
			enableZoom: true,
			zoomSpeed: 1,
			enableRotate: true,
			rotateSpeed: 1,
			rotatePanX: 0,
			rotatePanZ: 0,
			minDistance: 0,
			maxDistance: Infinity,
			minPolarAngle: 0,
			maxPolarAngle: Math.PI,
			minAzimuthAngle: -Infinity,
			maxAzimuthAngle: Infinity
		}, options);

		this.orbit = new Orbit(object, target);

		this._initialize();
	};

	_.extend(OrbitControl.prototype, Backbone.Events, {

		_initialize: function () {
			this._pointerTime = 0;
			this._pointerDeltaX = 0;
			this._pointerDeltaY = 0;
			this._velocityX = 0;
			this._velocityY = 0;

			if (this.rotatePanX)
				this._startTargetX = this.orbit.target.x;

			if (this.rotatePanZ)
				this._startTargetZ = this.orbit.target.z;

			this.setRotation(0, 0);

			if (this.cinematic) {
				this._cinematicSpeedX = 0;
				this._cinematicSpeedY = 0;
				this.listenTo(WebGLModel, 'update', this.updateCinematic);
			} else {
				this.enableRotate && this.listenTo(PointerModel, PointerModel.EVENT.DOWN, this.onPointerDown);
				this.enableZoom && this.listenTo(PointerModel, PointerModel.EVENT.WHEEL, this.onMouseWheel);
				this.enableZoom && this.listenTo(PointerModel, PointerModel.EVENT.PINCH_START, this.onPinchStart);
			}
		},

		onPointerDown: function (event) {
			if (event.button != this.button) return;
			this._pointerTime = WebGLModel.getElapsedTime();
			this.listenTo(PointerModel, PointerModel.EVENT.MOVE, this.onPointerMove);
			this.listenTo(PointerModel, PointerModel.EVENT.UP, this.onPointerUp);
		},

		onPointerMove: function (event) {
			var aspect = DisplayModel.get('aspect'),
				deltaX = this.rotateSpeed * (aspect > 1 ? event.normalDeltaX : event.normalDeltaX * aspect),
				deltaY = this.rotateSpeed * (aspect > 1 ? event.normalDeltaY / aspect : event.normalDeltaY),
				currentTime = WebGLModel.getElapsedTime(),
				deltaTime = currentTime - this._pointerTime;
			this._pointerTime = currentTime;
			this._pointerDeltaX += deltaX;
			this._pointerDeltaY += deltaY;
			if (deltaTime > 0) {
				this._velocityX = this._pointerDeltaX / deltaTime;
				this._velocityY = this._pointerDeltaY / deltaTime;
				this._pointerDeltaX = 0;
				this._pointerDeltaY = 0;
			}
			this.setRotation(deltaX, deltaY);
		},

		onPointerUp: function (event) {
			if (event.button != this.button) return;
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

		setRotation: function (deltaX, deltaY) {
			var theta = this.orbit.spherical.theta - 2 * Math.PI * deltaX,
				phi = this.orbit.spherical.phi - 2 * Math.PI * deltaY;
			this.orbit.spherical.theta = Math.max(this.minAzimuthAngle, Math.min(this.maxAzimuthAngle, theta));
			this.orbit.spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, phi));
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

		updateCinematic: function (delta) {
			var normalX = PointerModel.get('normalX');
			var normalY = PointerModel.get('normalY');
			var deltaX = normalX > 0.5 ? normalX - 0.5 : normalX < -0.5 ? normalX + 0.5 : 0;
			var deltaY = normalY > 0.5 ? normalY - 0.5 : normalY < -0.5 ? normalY + 0.5 : 0;

			this._cinematicSpeedX += delta * deltaX * -this.cinematicSpeed;
			this._cinematicSpeedY += delta * deltaY * -this.cinematicSpeed;

			if (Math.abs(this._cinematicSpeedX) > 0.001 || Math.abs(this._cinematicSpeedY) > 0.001)
				this.setRotation(delta * this._cinematicSpeedX, delta * this._cinematicSpeedY);

			this._cinematicSpeedX -= Math.min(delta, 1) * this._cinematicSpeedX;
			this._cinematicSpeedY -= Math.min(delta, 1) * this._cinematicSpeedY;

			WebGLModel.set({ cursorStyle: this.getCursorStyle(deltaY < 0, deltaY > 0, deltaX < 0, deltaX > 0) });
		},

		getCursorStyle: function (n, s, w, e) {
			if (n) {
				if (e) return 'ne-resize';
				if (w) return 'nw-resize';
				return 'n-resize';
			}
			if (s) {
				if (e) return 'se-resize';
				if (w) return 'sw-resize';
				return 's-resize';
			}
			if (e) return 'e-resize';
			if (w) return 'w-resize';
			return 'default';
		}
	});

	return OrbitControl;
});

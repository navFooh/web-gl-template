define([
	'Backbone',
	'three',
	'util/Orbit',
	'model/DisplayModel',
	'model/UserInputModel'
], function (Backbone, THREE, Orbit, DisplayModel, UserInputModel) {

	var OrbitControl = function (object, target) {

		this.enabled = false;
		this.orbit = new Orbit(object, target);

		this.enableZoom = true;
		this.zoomSpeed = 1.0;

		this.enableRotate = true;
		this.rotateSpeed = 1.0;

		this.start = function() {
			if (this.enabled) return;
			this.enabled = true;

			this.orbit.update();

			this.listenTo(UserInputModel, 'mousedown', this.onMouseDown);
			this.listenTo(UserInputModel, 'mousewheel', this.onMouseWheel);
		};

		this.stop = function() {
			if (!this.enabled) return;
			this.enabled = false;
			this.stopListening();
		};

		this.onMouseDown = function (event) {
			if (event.button != THREE.MOUSE.LEFT) return;
			this.listenTo(UserInputModel, 'mousemove', this.onMouseMove);
			this.listenTo(UserInputModel, 'mouseup', this.onMouseUp);
			this.listenTo(UserInputModel, 'mouseleave', this.onMouseUp);
		};

		this.onMouseMove = function(deltaX, deltaY) {
			this.orbit.rotateLeft(2 * Math.PI * deltaX / DisplayModel.get('width') * this.rotateSpeed);
			this.orbit.rotateUp(2 * Math.PI * deltaY / DisplayModel.get('height') * this.rotateSpeed);
			this.orbit.update();
		};

		this.onMouseUp = function() {
			this.stopListening(UserInputModel, 'mousemove mouseup mouseleave');
		};

		this.onMouseWheel = function(event) {
			var zoomScale = Math.pow(0.95, this.zoomSpeed);
			event.deltaY < 0
				? this.orbit.dollyOut(zoomScale)
				: this.orbit.dollyIn(zoomScale);
			this.orbit.update();
		};
	};

	_.extend(OrbitControl.prototype, Backbone.Events);

	return OrbitControl;
});

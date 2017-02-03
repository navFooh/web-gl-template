define([
	'backbone',
	'model/DisplayModel',
	'util/events/PointerEvents',
	'util/events/MouseEvents',
	'util/events/TouchEvents',
	'jquery-mousewheel'
], function (Backbone, DisplayModel, PointerEvents, MouseEvents, TouchEvents) {

	var PointerModel = Backbone.Model.extend({

		EVENT: {
			DOWN: 0,
			MOVE: 1,
			UP: 2,
			PINCH_START: 3,
			PINCH_MOVE: 4,
			PINCH_END: 5,
			WHEEL: 6
		},

		defaults: {
			element: document,
			pointerX: 0,
			pointerY: 0,
			normalX: 0,
			normalY: 0
		},

		initialize: function () {

			var element = this.get('element');

			$(element).on('mousewheel', this.trigger.bind(this, this.EVENT.WHEEL));

			if (PointerEvents.isSupported) {
				this.pointerEvents = new PointerEvents(element);
				this.listenToPointerEvents();
			} else {
				this.touchEvents = new TouchEvents(element);
				this.mouseEvents = new MouseEvents(element);
				this.listenToTouchEvents();
				this.listenToMouseEvents();
			}
		},

		listenToPointerEvents: function() {
			this.listenTo(this.pointerEvents, this.pointerEvents.EVENT.MOVE, this.onPointersMove);
			this.listenTo(this.pointerEvents, this.pointerEvents.EVENT.DOWN, this.onPointerDown);
			this.listenTo(this.pointerEvents, this.pointerEvents.EVENT.UP, this.onPointerUp);
		},

		listenToTouchEvents: function() {
			this.listenTo(this.touchEvents, this.touchEvents.EVENT.MOVE, this.onPointersMove);
			this.listenTo(this.touchEvents, this.touchEvents.EVENT.DOWN, this.onTouchDown);
			this.listenTo(this.touchEvents, this.touchEvents.EVENT.UP, this.onTouchUp);
		},

		listenToMouseEvents: function() {
			this.listenTo(this.mouseEvents, this.mouseEvents.EVENT.MOVE, this.onPointerMove);
			this.listenTo(this.mouseEvents, this.mouseEvents.EVENT.DOWN, this.onMouseDown);
			this.listenTo(this.mouseEvents, this.mouseEvents.EVENT.UP, this.onMouseUp);
		},

		// HANDLE POINTER UP AND DOWN

		onPointerDown: function(event) {
			this.setPointer(event);
			this.trigger(this.EVENT.DOWN, event);
		},

		onPointerUp: function(event) {
			this.setPinching(false);
			this.trigger(this.EVENT.UP, event);
		},

		// HANDLE TOUCH UP AND DOWN

		onTouchDown: function(event) {
			this.setPointer(event);
			this.trigger(this.EVENT.DOWN, event);
			this.stopListening(this.mouseEvents);
		},

		onTouchUp: function(event) {
			this.setPinching(false);
			this.trigger(this.EVENT.UP, event);
			this.listenToMouseEvents();
		},

		// HANDLE MOUSE UP AND DOWN

		onMouseDown: function(event) {
			this.setPointer(event);
			this.trigger(this.EVENT.DOWN, event);
			this.stopListening(this.touchEvents);
		},

		onMouseUp: function(event) {
			this.trigger(this.EVENT.UP, event);
			event.buttons == 0 && this.listenToTouchEvents();
		},

		// HANDLE PINCH START, MOVE & END

		setPinching: function(pointers) {
			var pinching = pointers && pointers.length == 2;
			if (pinching && !this.pinching) this.onPinchStart(pointers);
			if (!pinching && this.pinching) this.onPinchEnd();
		},

		onPinchStart: function(pointers) {
			this.pinching = true;
			this.pinchStart = this.getPinchLength(pointers);
			this.trigger(this.EVENT.PINCH_START);
		},

		onPinchMove: function(pointers) {
			var scale = this.getPinchLength(pointers) / this.pinchStart;
			this.trigger(this.EVENT.PINCH_MOVE, { scale: scale });
		},

		onPinchEnd: function() {
			this.pinching = false;
			this.trigger(this.EVENT.PINCH_END);
		},

		getPinchLength: function(pointers) {
			var dx = pointers[0].clientX - pointers[1].clientX,
				dy = pointers[0].clientY - pointers[1].clientY;
			return Math.sqrt(dx * dx + dy * dy);
		},

		// HANDLE MULTIPLE AND SINGLE POINTER MOVES

		onPointersMove: function(pointers) {
			this.setPinching(pointers);
			this.onPointerMove(this.getAverage(pointers));
			this.pinching && this.onPinchMove(pointers);
		},

		onPointerMove: function(event) {
			var pointerPrevX = this.get('pointerX'),
				pointerPrevY = this.get('pointerY'),
				normalPrevX = this.get('normalX'),
				normalPrevY = this.get('normalY');
			this.setPointer(event);
			this.trigger(this.EVENT.MOVE, {
				pointerDeltaX: this.get('pointerX') - pointerPrevX,
				pointerDeltaY: this.get('pointerY') - pointerPrevY,
				NormalDeltaX: this.get('normalX') - normalPrevX,
				NormalDeltaY: this.get('normalY') - normalPrevY
			});
		},

		setPointer: function(event) {
			var width = DisplayModel.get('width'),
				height = DisplayModel.get('height'),
				normal = Math.max(width, height) * 0.5;
			this.set({
				pointerX: event.clientX,
				pointerY: event.clientY,
				normalX: event.clientX / normal - 1,
				normalY: event.clientY / normal - 1
			})
		},

		getAverage: function() {
			var add = function(a, b) { return a + b };
			return function(pointers) {
				return {
					clientX: _.reduce(_.pluck(pointers, 'clientX'), add) / pointers.length,
					clientY: _.reduce(_.pluck(pointers, 'clientY'), add) / pointers.length
				}
			}
		}()
	});

	return new PointerModel();
});

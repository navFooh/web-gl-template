define([
	'backbone',
	'model/DisplayModel',
	'util/events/PointerEvents',
	'util/events/MouseEvents',
	'util/events/TouchEvents',
	'jquery-mousewheel'
], function (Backbone, DisplayModel, PointerEvents, MouseEvents, TouchEvents) {

	var PointerModel = Backbone.Model.extend({

		// NOTE: DOWN AND UP CAN BE FIRED FOR EACH POINTER BUTTON
		// CHECK FOR A SPECIFIC BUTTON WHEN INITIATING INTERACTION

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
			element: null,
			pointerX: 0,
			pointerY: 0,
			normalX: 0,
			normalY: 0
		},

		initialize: function () {
			this.on('change:element', this.onChangeElement);
		},

		onChangeElement: function() {

			if (this.previous('element')) {
				this.stopListening();
				this.$element && this.$element.off('mousewheel');
				this.pointerEvents && this.pointerEvents.remove();
				this.touchEvents && this.touchEvents.remove();
				this.mouseEvents && this.mouseEvents.remove();
				delete this.$element;
				delete this.pointerEvents;
				delete this.touchEvents;
				delete this.mouseEvents;
			}

			var element = this.get('element');
			if (element == document) throw 'PointerEvents do not fire pointerleave on document in IE / Edge';
			if (!element) return;

			this.$element = $(element);
			this.$element.on('mousewheel', this.trigger.bind(this, this.EVENT.WHEEL));

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
			this.listenTo(this.pointerEvents, this.pointerEvents.EVENT.CHANGE, this.onPointersChange);
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

		onPointersChange: function(pointers) {
			this.setPointer(this.getAverage(pointers));
			this.setPinching(false);
		},

		onPointerDown: function(pointer, first) {
			first && this.trigger(this.EVENT.DOWN, { button: pointer.button });
		},

		onPointerUp: function(pointer, last) {
			last && this.trigger(this.EVENT.UP, { button: pointer.button });
		},

		// HANDLE TOUCH UP AND DOWN

		onTouchDown: function(touches, first) {
			this.setPointer(this.getAverage(touches));
			if (first) {
				this.trigger(this.EVENT.DOWN, { button: 0 });
				this.stopListening(this.mouseEvents);
			}
		},

		onTouchUp: function(touches, last) {
			this.setPointer(this.getAverage(touches));
			this.setPinching(false);
			if (last) {
				this.trigger(this.EVENT.UP, { button: 0 });
				this.listenToMouseEvents();
			}
		},

		// HANDLE MOUSE UP AND DOWN

		onMouseDown: function(event) {
			this.setPointer(event);
			this.trigger(this.EVENT.DOWN, { button: event.button });
			this.stopListening(this.touchEvents);
		},

		onMouseUp: function(event) {
			this.trigger(this.EVENT.UP, { button: event.button });
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
			if (!event) return;
			var pointerPrevX = this.get('pointerX'),
				pointerPrevY = this.get('pointerY'),
				normalPrevX = this.get('normalX'),
				normalPrevY = this.get('normalY');
			this.setPointer(event);
			this.trigger(this.EVENT.MOVE, {
				pointerDeltaX: this.get('pointerX') - pointerPrevX,
				pointerDeltaY: this.get('pointerY') - pointerPrevY,
				normalDeltaX: this.get('normalX') - normalPrevX,
				normalDeltaY: this.get('normalY') - normalPrevY
			});
		},

		setPointer: function(event) {
			if (!event) return;
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
				if (!pointers || !pointers.length) return;
				return pointers.length == 1 ? pointers[0] : {
					clientX: _.reduce(_.pluck(pointers, 'clientX'), add) / pointers.length,
					clientY: _.reduce(_.pluck(pointers, 'clientY'), add) / pointers.length
				}
			}
		}()
	});

	return new PointerModel();
});

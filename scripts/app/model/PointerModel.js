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
			active: false,
			pinching: false,
			pinchStart: 0,
			pinchScale: 1,
			pointerX: 0,
			pointerY: 0,
			normalX: 0,
			normalY: 0
		},

		initialize: function () {

			var element = this.get('element');

			$(element).on('mousewheel', this.trigger.bind(this, this.EVENT.WHEEL));

			if (PointerEvents.isSupported) {

				var pointerEvents = new PointerEvents(element);
				this.listenTo(pointerEvents, pointerEvents.EVENT.DOWN, this.onPointersDown);
				this.listenTo(pointerEvents, pointerEvents.EVENT.MOVE, this.onPointersMove);
				this.listenTo(pointerEvents, pointerEvents.EVENT.UP, this.onPointersUp);

			} else {

				var touchEvents = new TouchEvents(element);
				this.listenTo(touchEvents, touchEvents.EVENT.DOWN, this.onPointersDown);
				this.listenTo(touchEvents, touchEvents.EVENT.MOVE, this.onPointersMove);
				this.listenTo(touchEvents, touchEvents.EVENT.UP, this.onPointersUp);

				var mouseEvents = new MouseEvents(element);
				this.listenTo(mouseEvents, mouseEvents.EVENT.DOWN, this.trigger.bind(this, this.EVENT.DOWN));
				this.listenTo(mouseEvents, mouseEvents.EVENT.MOVE, this.onPointerMove);
				this.listenTo(mouseEvents, mouseEvents.EVENT.UP, this.trigger.bind(this, this.EVENT.UP));
			}
		},

		onPointersDown: function(pointers) {

			this.setPointer(this.getAverage(pointers));

			if (!this.get('active')) {
				this.set({ active: true });
				this.trigger(this.EVENT.DOWN, { button: 0 });
			}

			this.setPinching(pointers);
		},

		onPointersMove: function(pointers) {
			this.onPointerMove(this.getAverage(pointers));
			this.get('pinching') && this.onPinchMove(pointers);
		},

		onPointersUp: function(pointers) {

			this.setPinching(pointers);

			if (this.get('active') && pointers.length == 0) {
				this.set({ active: false });
				this.trigger(this.EVENT.UP, { button: 0 });
			}
		},

		setPinching: function(pointers) {
			var pinching = pointers.length == 2;
			if (pinching && !this.get('pinching')) this.onPinchStart(pointers);
			if (!pinching && this.get('pinching')) this.onPinchEnd();
		},

		onPinchStart: function(pointers) {
			this.set({
				pinching: true,
				pinchScale: 1,
				pinchStart: this.getPinchLength(pointers)
			}).trigger(this.EVENT.PINCH_START);
		},

		onPinchMove: function(pointers) {
			var prev = this.get('pinchScale'),
				length = this.getPinchLength(pointers);
			this.set({ pinchScale: length / this.get('pinchStart') });
			this.trigger(this.EVENT.PINCH_MOVE, { delta: this.get('pinchScale') - prev });
		},

		onPinchEnd: function() {
			this.set({ pinching: false });
			this.trigger(this.EVENT.PINCH_END);
		},

		getPinchLength: function(pointers) {
			var dx = pointers[0].clientX - pointers[1].clientX,
				dy = pointers[0].clientY - pointers[1].clientY;
			return Math.sqrt(dx * dx + dy * dy);
		},

		getAverage: function() {
			var add = function(a, b) { return a + b };
			return function(pointers) {
				return {
					clientX: _.reduce(_.pluck(pointers, 'clientX'), add) / pointers.length,
					clientY: _.reduce(_.pluck(pointers, 'clientY'), add) / pointers.length
				}
			}
		}(),

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
		}
	});

	return new PointerModel();
});

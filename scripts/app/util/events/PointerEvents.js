define([
	'backbone-Util',
	'underscore'
], function (Util, _) {

	return Util.extend({

		EVENT: {
			DOWN: 0,
			MOVE: 1,
			UP: 2
		},

		pointers: {
			mouse: [],
			touch: [],
			pen: []
		},

		activeType: null,

		initialize: function (element) {

			this.element = element || document;

			var PointerEvent = window.PointerEvent || window.MSPointerEvent;
			if (PointerEvent) {

				var MS = PointerEvent === window.MSPointerEvent;

				this.element.addEventListener(MS ? 'MSPointerDown' : 'pointerdown', this.onDown.bind(this));
				this.element.addEventListener(MS ? 'MSPointerMove' : 'pointermove', this.onMove.bind(this));
				this.element.addEventListener(MS ? 'MSPointerUp' : 'pointerup', this.onUp.bind(this));
				this.element.addEventListener(MS ? 'MSPointerEnter' : 'pointerenter', this.addPointer.bind(this));
				this.element.addEventListener(MS ? 'MSPointerLeave' : 'pointerleave', this.removePointer.bind(this));
				this.element.addEventListener(MS ? 'MSPointerCancel' : 'pointercancel', this.removePointer.bind(this));
			}
		},

		onDown: function(event) {
			event.preventDefault();
			this.trigger(this.EVENT.DOWN, this.pointers);
		},

		onMove: function(event) {
			event.preventDefault();
			this.replacePointer(event);
			this.trigger(this.EVENT.MOVE, this.pointers);
		},

		onUp: function(event) {
			event.preventDefault();
			this.trigger(this.EVENT.UP, this.pointers);
		},

		addPointer: function(event) {
			var pointers = this.pointers[event.pointerType],
				index = this.getIndex(pointers, event.pointerId);
			if (index == -1) pointers.push(event);
		},

		removePointer: function(event) {
			var pointers = this.pointers[event.pointerType],
				index = this.getIndex(pointers, event.pointerId);
			if (index > -1) pointers.splice(index, 1);
		},

		replacePointer: function(event) {
			var pointers = this.pointers[event.pointerType],
				index = this.getIndex(pointers, event.pointerId);
			if (index > -1) pointers.splice(index, 1, event);
		},

		getIndex: function(pointers, id) {
			return _.findIndex(pointers, function(pointer) {
				return pointer.pointerId == id;
			});
		}

	}, {
		isSupported: !!(window.PointerEvent || window.MSPointerEvent)
	});
});

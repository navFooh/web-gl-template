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

		initialize: function (element) {

			this.element = element || document;

			var PointerEvent = window.PointerEvent || window.MSPointerEvent;
			if (PointerEvent) {

				this.activeType = null;

				this.pointers = {
					mouse: [],
					touch: [],
					pen: []
				};

				var MS = PointerEvent === window.MSPointerEvent;

				this.element.addEventListener(MS ? 'MSPointerUp' : 'pointerup', this.setPointer.bind(this));
				this.element.addEventListener(MS ? 'MSPointerDown' : 'pointerdown', this.setPointer.bind(this));
				this.element.addEventListener(MS ? 'MSPointerMove' : 'pointermove', this.onMove.bind(this));
				this.element.addEventListener(MS ? 'MSPointerEnter' : 'pointerenter', this.setPointer.bind(this));
				this.element.addEventListener(MS ? 'MSPointerLeave' : 'pointerleave', this.unsetPointer.bind(this));
				this.element.addEventListener(MS ? 'MSPointerCancel' : 'pointercancel', this.unsetPointer.bind(this));
			}
		},

		onMove: function(event) {
			event.preventDefault();
			this.setPointer(event);

			if (this.activeType == null || this.activeType == event.pointerType) {
				this.trigger(this.EVENT.MOVE, this.pointers[event.pointerType]);
			}
		},

		setPointer: function(event) {
			var pointers = this.pointers[event.pointerType],
				index = this.getIndex(pointers, event.pointerId),
				pointer = this.copyPointer(event),
				previous = index > -1 ? pointers[index] : { button: -1, buttons: 0 };

			this.analyzeButtons(previous, pointer);

			index == -1
				? pointers.push(pointer)
				: pointers.splice(index, 1, pointer);
		},

		unsetPointer: function(event) {
			var pointers = this.pointers[event.pointerType],
				index = this.getIndex(pointers, event.pointerId);
			if (index > -1) {
				var pointer = pointers.splice(index, 1)[0];
				this.analyzeButtons(pointer, { button: -1, buttons: 0 })
			}
		},

		copyPointer: function(pointer) {
			return {
				pointerId: pointer.pointerId,
				clientX: pointer.clientX,
				clientY: pointer.clientY,
				button: pointer.button,
				buttons: pointer.buttons
			}
		},

		analyzeButtons: function(prev, next) {
			if (prev.buttons == next.buttons) return;
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

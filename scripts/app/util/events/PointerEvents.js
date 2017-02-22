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
				this.buttons = [];
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
			// trigger MOVE when this pointer type is active or none is active
			if (this.activeType == null || this.activeType == event.pointerType) {
				this.trigger(this.EVENT.MOVE, this.pointers[event.pointerType]);
			}
		},

		setPointer: function(event) {
			// check if the pointer is new and the pressed buttons changed
			var pointers = this.pointers[event.pointerType],
				index = this.getIndex(pointers, event.pointerId),
				pointer = this.copyPointer(event),
				buttonsChanged = index > -1
					? pointer.buttons != pointers[index].buttons
					: pointer.buttons > 0;
			// update the pointer in the array or add it
			index > -1
				? pointers.splice(index, 1, pointer)
				: pointers.push(pointer);
			// capture or release the button when its state changed
			if (buttonsChanged && pointer.button > -1)
				this.isDown(pointer.button, pointer.buttons)
					? this.captureButton(pointer)
					: this.releaseButton(pointer);
		},

		unsetPointer: function(event) {
			// find pointer in array of stored pointers
			var pointers = this.pointers[event.pointerType],
				index = this.getIndex(pointers, event.pointerId);
			if (index == -1) return;
			// if we have the pointer, remove it
			var pointer = pointers.splice(index, 1)[0];
			if (pointer.buttons == 0) return;
			// if some buttons on this pointer are still pressed, release them
			for (var i = 0, l = this.buttons.length; i < l; i++) {
				// ignore buttons that were never or currently aren't pressed
				if (typeof this.buttons[i] === 'undefined' || this.buttons[i] == 0) continue;
				// release the button if it was still pressed down
				if (this.isDown(i, pointer.buttons))
					this.releaseButton(_.extend(pointer, { button: i }));
			}
		},

		captureButton: function(pointers, pointer, button) {
			// make this the active pointer type if not set
			if (this.activeType == null)
				this.activeType = pointer.pointerType;
			// do nothing if we're not the active pointer type
			if (this.activeType != pointer.pointerType) return;
			// create counter for button type if not yet exists
			if (typeof this.buttons[button] === 'undefined')
				this.buttons[button] = 0;
			// increment counter for pressed button and trigger DOWN
			var first = this.buttons[button]++ == 0;
			this.trigger(this.EVENT.DOWN, pointers, pointer, first);
		},

		releaseButton: function(pointers, pointer, button) {
			// do nothing if we're not the active pointer type
			if (this.activeType != pointer.pointerType) return;
			// decrement counter for released button and trigger UP
			var last = --this.buttons[button] == 0;
			this.trigger(this.EVENT.UP, pointers, pointer, last);
			// release activeType if no buttons are pressed
			var inactive = !_.some(this.buttons);
			if (inactive) this.activeType = null;
		},

		getIndex: function(pointers, id) {
			return _.findIndex(pointers, function(pointer) {
				return pointer.pointerId == id;
			});
		},

		copyPointer: function(pointer) {
			return {
				button: pointer.button,
				buttons: pointer.buttons,
				clientX: pointer.clientX,
				clientY: pointer.clientY,
				pointerId: pointer.pointerId,
				pointerType: pointer.pointerType
			}
		},

		isDown: function() {
			var BUTTON_BITS = [0,2,1,3,4,5];
			return function(button, buttons) {
				return (buttons & (1 << BUTTON_BITS[button])) > 0
			}
		}()

	}, {
		isSupported: !!(window.PointerEvent || window.MSPointerEvent)
	});
});

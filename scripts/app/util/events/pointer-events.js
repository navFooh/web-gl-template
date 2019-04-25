define([
	'backbone-util',
	'underscore'
], function (Util, _) {

	var BIT_TO_BUTTON = [0,2,1,3,4,5];

	return Util.extend({

		EVENT: {
			CHANGE: 0,
			DOWN: 1,
			MOVE: 2,
			UP: 3
		},

		initialize: function (element) {
			if (!element) throw 'Supply a target element for PointerEvents';
			this.element = element;

			var PointerEvent = window.PointerEvent || window.MSPointerEvent;
			if (!PointerEvent) throw 'PointerEvents are not supported, check PointerEvents.isSupported';

			this.activeType = null; // active pointer type: 'mouse', 'pen', 'touch' or null
			this.buttons = [];      // counts pressed buttons for the active pointer type
			this.pointers = {       // stores all pointers found on the element per type
				mouse: [],
				touch: [],
				pen: []
			};

			this.setPointer = this.setPointer.bind(this);
			this.unsetPointer = this.unsetPointer.bind(this);

			this.MS = PointerEvent === window.MSPointerEvent;

			this.element.addEventListener(this.MS ? 'MSPointerUp' : 'pointerup', this.setPointer);
			this.element.addEventListener(this.MS ? 'MSPointerDown' : 'pointerdown', this.setPointer);
			this.element.addEventListener(this.MS ? 'MSPointerMove' : 'pointermove', this.setPointer);
			this.element.addEventListener(this.MS ? 'MSPointerEnter' : 'pointerenter', this.setPointer);
			this.element.addEventListener(this.MS ? 'MSPointerLeave' : 'pointerleave', this.unsetPointer);
			this.element.addEventListener(this.MS ? 'MSPointerCancel' : 'pointercancel', this.unsetPointer);
		},

		remove: function () {
			this.element.removeEventListener(this.MS ? 'MSPointerUp' : 'pointerup', this.setPointer);
			this.element.removeEventListener(this.MS ? 'MSPointerDown' : 'pointerdown', this.setPointer);
			this.element.removeEventListener(this.MS ? 'MSPointerMove' : 'pointermove', this.setPointer);
			this.element.removeEventListener(this.MS ? 'MSPointerEnter' : 'pointerenter', this.setPointer);
			this.element.removeEventListener(this.MS ? 'MSPointerLeave' : 'pointerleave', this.unsetPointer);
			this.element.removeEventListener(this.MS ? 'MSPointerCancel' : 'pointercancel', this.unsetPointer);
			Util.prototype.remove.apply(this);
		},

		setPointer: function (event) {
			// find pointer in array of stored pointers
			var pointer = this.copyPointer(event);
			var pointers = this.pointers[pointer.pointerType];
			var pointerIndex = this.getIndex(pointers, pointer.pointerId);
			var pointerIsNew = pointerIndex === -1;
			var previousButtons = pointerIsNew ? 0 : pointers[pointerIndex].buttons;

			// update pointers
			if (pointerIsNew) {
				pointers.push(pointer);
				this.trigger(this.EVENT.CHANGE, pointers);
			} else {
				pointers.splice(pointerIndex, 1, pointer);
			}

			// trigger DOWN or UP when the pointer buttons changed
			if (pointer.buttons !== previousButtons)
				this.compareButtons(pointer, previousButtons);

			// trigger MOVE if the pointer position changed
			if (!pointerIsNew && this.pointerMoved(pointer, pointers[pointerIndex]))
				this.moveHandler(pointer)
		},

		unsetPointer: function (event) {
			// find pointer in array of stored pointers
			var pointers = this.pointers[event.pointerType],
				index = this.getIndex(pointers, event.pointerId);
			if (index == -1) return;
			// if we have the pointer, remove it
			var pointer = pointers.splice(index, 1)[0];
			this.trigger(this.EVENT.CHANGE, pointers);
			if (pointer.buttons == 0) return;
			// release the buttons that are still pressed
			var final = this.copyPointer(event); final.buttons = 0;
			this.compareButtons(final, pointer.buttons);
		},

		moveHandler: function (pointer) {
			// trigger MOVE when this is the active pointer type or none is
			if (this.activeType == null || this.activeType == pointer.pointerType)
				this.trigger(this.EVENT.MOVE, this.pointers[pointer.pointerType]);
		},

		compareButtons: function (pointer, previousButtons) {
			// copy buttons so original doesn't alter
			var buttons = pointer.buttons, bit = 0;

			// iterate over the buttons bitmask
			while (buttons || previousButtons) {

				// get buttons states
				var isDown = buttons & 1,
					wasDown = previousButtons & 1,
					button = BIT_TO_BUTTON[bit++];

				// capture and release buttons according to states
				isDown && !wasDown && this.captureButton(pointer, button);
				!isDown && wasDown && this.releaseButton(pointer, button);

				// shift the bits
				buttons >>= 1;
				previousButtons >>= 1;
			}
		},

		captureButton: function (pointer, button) {
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
			this.trigger(this.EVENT.DOWN, pointer, first);
		},

		releaseButton: function (pointer, button) {
			// do nothing if we're not the active pointer type
			if (this.activeType != pointer.pointerType) return;
			// decrement counter for released button and trigger UP
			var last = --this.buttons[button] == 0;
			this.trigger(this.EVENT.UP, pointer, last);
			// release activeType if no buttons are pressed
			var inactive = !_.some(this.buttons);
			if (inactive) this.activeType = null;
		},

		getIndex: function (pointers, pointerId) {
			return _.findIndex(pointers, function (pointer) {
				return pointer.pointerId == pointerId;
			});
		},

		copyPointer: function (pointer) {
			return {
				button: pointer.button,
				buttons: pointer.buttons,
				clientX: pointer.clientX,
				clientY: pointer.clientY,
				pointerId: pointer.pointerId,
				pointerType: pointer.pointerType,
				target: pointer.target
			}
		},

		pointerMoved: function (pointer, previousPointer) {
			return pointer.clientX !== previousPointer.clientX || pointer.clientY !== previousPointer.clientY;
		}

	}, {
		isSupported: !!(window.PointerEvent || window.MSPointerEvent)
	});
});

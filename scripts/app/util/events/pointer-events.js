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

			this.activeType = null;			// active pointer type: 'mouse', 'pen', 'touch' or null
			this.activeTypeLocked = false;	// when a pointer button is pressed, it locks the active type
			this.buttons = [];      		// counts pressed buttons for the active pointer type
			this.pointers = {       		// stores all pointers found on the element per type
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
			var pointerMoved = !pointerIsNew && this.pointerMoved(pointer, pointers[pointerIndex]);
			var previousButtons = pointerIsNew ? 0 : pointers[pointerIndex].buttons;

			// add / update pointer
			pointerIsNew
				? pointers.push(pointer)
				: pointers.splice(pointerIndex, 1, pointer);

			// check active type properties
			var activeTypeChanged = false;
			if (this.activeType !== pointer.pointerType && !this.activeTypeLocked) {
				this.activeType = pointer.pointerType;
				activeTypeChanged = true;
			}

			// only trigger events for the active type
			if (this.activeType === pointer.pointerType) {

				// trigger CHANGE when there is a new pointer configuration
				if (pointerIsNew || activeTypeChanged)
					this.trigger(this.EVENT.CHANGE, pointers);

				// trigger MOVE if the pointer position changed
				if (pointerMoved)
					this.trigger(this.EVENT.MOVE, pointers);

				// trigger DOWN or UP when the pointer buttons changed
				if (pointer.buttons !== previousButtons)
					this.compareButtons(pointer, previousButtons);
			}
		},

		unsetPointer: function (event) {
			// find pointer in array of stored pointers
			var pointers = this.pointers[event.pointerType];
			var pointerIndex = this.getIndex(pointers, event.pointerId);

			// do nothing if pointer wasn't stored
			if (pointerIndex === -1) return;

			// remove pointer
			var pointer = pointers.splice(pointerIndex, 1)[0];

			// only trigger events for the active type
			if (this.activeType === pointer.pointerType) {

				// trigger UP for any pressed buttons
				if (pointer.buttons !== 0) {
					var final = this.copyPointer(event);
					final.buttons = 0;
					this.compareButtons(final, pointer.buttons);
				}

				// trigger CHANGE event
				this.trigger(this.EVENT.CHANGE, pointers);
			}
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
			// prevent active type from changing
			this.activeTypeLocked = true;

			// create counter for button type if not yet exists
			if (typeof this.buttons[button] === 'undefined')
				this.buttons[button] = 0;

			// increment counter for pressed button and trigger DOWN
			var first = this.buttons[button]++ === 0;
			this.trigger(this.EVENT.DOWN, button, pointer.target, first);
		},

		releaseButton: function (pointer, button) {
			// decrement counter for released button and trigger UP
			var last = --this.buttons[button] === 0;
			this.trigger(this.EVENT.UP, button, pointer.target, last);

			// release active type lock if no buttons are pressed
			if (!_.some(this.buttons))
				this.activeTypeLocked = false;
		},

		getIndex: function (pointers, pointerId) {
			return _.findIndex(pointers, function (pointer) {
				return pointer.pointerId == pointerId;
			});
		},

		copyPointer: function (pointer) {
			return {
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

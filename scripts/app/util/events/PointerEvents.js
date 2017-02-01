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

		pointers: [],

		initialize: function (element) {

			this.element = element || document;

			var PointerEvent = window.PointerEvent || window.MSPointerEvent;
			if (PointerEvent) {

				var MS = PointerEvent === window.MSPointerEvent;

				this.element.addEventListener(MS ? 'MSPointerEnter' : 'pointerenter', this.onEnter.bind(this));
				this.element.addEventListener(MS ? 'MSPointerDown' : 'pointerdown', this.onDown.bind(this));
				this.element.addEventListener(MS ? 'MSPointerMove' : 'pointermove', this.onMove.bind(this));
				this.element.addEventListener(MS ? 'MSPointerUp' : 'pointerup', this.onUp.bind(this));
				this.element.addEventListener(MS ? 'MSPointerLeave' : 'pointerleave', this.onLeave.bind(this));
				this.element.addEventListener(MS ? 'MSPointerCancel' : 'pointercancel', this.onLeave.bind(this));
			}
		},

		onEnter: function(event) {
			event.preventDefault();
			this.addPointer(event);
		},

		onDown: function(event) {
			event.preventDefault();
			this.trigger(this.EVENT.DOWN, this.pointers);
		},

		onMove: function(event) {
			event.preventDefault();
			this.replacePointer();
			this.trigger(this.EVENT.MOVE, this.pointers);
		},

		onUp: function(event) {
			event.preventDefault();
			this.trigger(this.EVENT.UP, this.pointers);
		},

		onLeave: function(event) {
			event.preventDefault();
			this.removePointer(event);
		},

		addPointer: function(event) {
			var index = this.getIndex(event.pointerId);
			if (index == -1) this.pointers.push(event);
		},

		removePointer: function(event) {
			var index = this.getIndex(event.pointerId);
			if (index > -1) this.pointers.splice(index, 1);
		},

		replacePointer: function(event) {
			var index = this.getIndex(event.pointerId);
			if (index > -1) this.pointers.splice(index, 1, event);
		},

		getIndex: function(id) {
			return _.findIndex(this.pointers, function(pointer) {
				return pointer.pointerId == id;
			});
		}

	}, {
		isSupported: !!(window.PointerEvent || window.MSPointerEvent)
	});
});

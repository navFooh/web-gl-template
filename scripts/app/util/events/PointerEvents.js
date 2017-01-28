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

				this.element.addEventListener(MS ? 'MSPointerDown' : 'pointerdown', this.onDown.bind(this), true);
				this.element.addEventListener(MS ? 'MSPointerMove' : 'pointermove', this.onMove.bind(this), true);
				this.element.addEventListener(MS ? 'MSPointerUp' : 'pointerup', this.onUp.bind(this), true);
				this.element.addEventListener(MS ? 'MSPointerLeave' : 'pointerleave', this.onUp.bind(this), true);
				this.element.addEventListener(MS ? 'MSPointerCancel' : 'pointercancel', this.onUp.bind(this), true);
			}
		},

		onDown: function(event) {
			event.preventDefault();
			this.pointers.push(event);
			this.trigger(this.EVENT.DOWN, this.pointers);
		},

		onMove: function(event) {
			event.preventDefault();
			var index = this.getIndex(event.pointerId);
			if (index > -1) {
				this.pointers.splice(index, 1, event);
				this.trigger(this.EVENT.MOVE, this.pointers);
			} else {
				console.warn('PointerEvents::onMove -> missing pointer in array');
			}
		},

		onUp: function(event) {
			event.preventDefault();
			var index = this.getIndex(event.pointerId);
			if (index > -1) {
				this.pointers.splice(index, 1);
				this.trigger(this.EVENT.UP, this.pointers);
			} else {
				console.warn('PointerEvents::onUp -> missing pointer in array');
			}
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

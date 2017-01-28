define(['backbone-Util'], function (Util) {

	return Util.extend({

		EVENT: {
			DOWN: 0,
			MOVE: 1,
			UP: 2
		},

		initialize: function (element) {

			this.element = element || document;
			this.element.addEventListener('touchstart', this.onStart.bind(this), true);
			this.element.addEventListener('touchmove', this.onMove.bind(this), true);
			this.element.addEventListener('touchend', this.onEnd.bind(this), true);
			this.element.addEventListener('touchcancel', this.onEnd.bind(this), true);
		},

		onStart: function(event) {
			this.trigger(this.EVENT.DOWN, event.touches);
		},

		onMove: function(event) {
			event.preventDefault();
			this.trigger(this.EVENT.MOVE, event.touches);
		},

		onEnd: function(event) {
			this.trigger(this.EVENT.UP, event.touches);
		}
	});
});

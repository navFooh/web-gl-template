define(['backbone-Util'], function (Util) {

	return Util.extend({

		EVENT: {
			DOWN: 0,
			MOVE: 1,
			UP: 2
		},

		initialize: function (element) {

			this.element = element || document;
			this.element.addEventListener('touchstart', this.onStart.bind(this));
			this.element.addEventListener('touchmove', this.onMove.bind(this));
			this.element.addEventListener('touchend', this.onEnd.bind(this));
			this.element.addEventListener('touchcancel', this.onEnd.bind(this));
		},

		onStart: function() {
			if (!this.touching) {
				this.touching = true;
				this.trigger(this.EVENT.DOWN, { button: 0 });
			}
		},

		onMove: function(event) {
			event.preventDefault();
			this.trigger(this.EVENT.MOVE, event.touches);
		},

		onEnd: function(event) {
			if (this.touching && event.touches.length == 0) {
				this.touching = false;
				this.trigger(this.EVENT.UP, { button: 0 });
			}
		}
	});
});

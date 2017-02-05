define(['backbone-Util'], function (Util) {

	return Util.extend({

		EVENT: {
			DOWN: 0,
			MOVE: 1,
			UP: 2
		},

		initialize: function (element) {

			this.active = false;

			this.element = element || document;
			this.element.addEventListener('mousedown', this.onDown.bind(this));
			this.element.addEventListener('mousemove', this.trigger.bind(this, this.EVENT.MOVE));
			this.element.addEventListener('mouseup', this.onUp.bind(this));
			this.element.addEventListener('mouseleave', this.onUp.bind(this));
		},

		onDown: function(event) {
			!this.active && this.trigger(this.EVENT.DOWN, event);
			this.active = true;
		},

		onUp: function(event) {
			this.active && this.trigger(this.EVENT.UP, event);
			this.active = false;
		}
	});
});

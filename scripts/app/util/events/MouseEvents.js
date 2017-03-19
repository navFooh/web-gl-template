define(['backbone-Util'], function (Util) {

	return Util.extend({

		EVENT: {
			DOWN: 0,
			MOVE: 1,
			UP: 2
		},

		initialize: function (element) {
			if (!element) throw 'Supply a target element for MouseEvents';
			this.element = element;

			this.buttons = [];
			this.element.addEventListener('mousedown', this.onDown.bind(this));
			this.element.addEventListener('mousemove', this.trigger.bind(this, this.EVENT.MOVE));
			this.element.addEventListener('mouseup', this.onUp.bind(this));
			this.element.addEventListener('mouseleave', this.onUp.bind(this));
		},

		onDown: function(event) {
			!this.buttons[event.button] && this.trigger(this.EVENT.DOWN, event);
			this.buttons[event.button] = true;
		},

		onUp: function(event) {
			this.buttons[event.button] && this.trigger(this.EVENT.UP, event);
			this.buttons[event.button] = false;
		}
	});
});

define(['backbone-util'], function (Util) {

	return Util.extend({

		EVENT: {
			ENTER: 0,
			LEAVE: 1,
			DOWN: 2,
			MOVE: 3,
			UP: 4
		},

		initialize: function (element) {
			if (!element) throw 'Supply a target element for MouseEvents';
			this.element = element;

			this.buttons = [];

			this.onEnter = this.trigger.bind(this, this.EVENT.ENTER);
			this.onLeave = this.onLeave.bind(this);
			this.onDown = this.onDown.bind(this);
			this.onMove = this.onMove.bind(this);
			this.onUp = this.onUp.bind(this);

			this.element.addEventListener('mouseenter', this.onEnter);
			this.element.addEventListener('mouseleave', this.onLeave);
			this.element.addEventListener('mousedown', this.onDown);
			this.element.addEventListener('mousemove', this.onMove);
			this.element.addEventListener('mouseup', this.onUp);
		},

		remove: function () {
			this.element.removeEventListener('mouseenter', this.onEnter);
			this.element.removeEventListener('mouseleave', this.onLeave);
			this.element.removeEventListener('mousedown', this.onDown);
			this.element.removeEventListener('mousemove', this.onMove);
			this.element.removeEventListener('mouseup', this.onUp);
			Util.prototype.remove.apply(this);
		},

		onLeave: function (event) {
			for (var i = 0; i < this.buttons.length; i++) {
				this.buttons[i] && this.onUp({ button: i, target: event.target });
			}
			this.trigger(this.EVENT.LEAVE, event);
		},

		onDown: function (event) {
			!this.buttons[event.button] && this.trigger(this.EVENT.DOWN, event.button, event.target);
			this.buttons[event.button] = true;
		},

		onMove: function (event) {
			this.trigger(this.EVENT.MOVE, event);
		},

		onUp: function (event) {
			this.buttons[event.button] && this.trigger(this.EVENT.UP, event.button, event.target);
			this.buttons[event.button] = false;
		}
	});
});

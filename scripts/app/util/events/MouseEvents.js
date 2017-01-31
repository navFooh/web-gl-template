define(['backbone-Util'], function (Util) {

	return Util.extend({

		EVENT: {
			DOWN: 0,
			MOVE: 1,
			UP: 2
		},

		initialize: function (element) {

			this.element = element || document;
			this.element.addEventListener('mousedown', this.trigger.bind(this, this.EVENT.DOWN));
			this.element.addEventListener('mousemove', this.trigger.bind(this, this.EVENT.MOVE));
			this.element.addEventListener('mouseup', this.trigger.bind(this, this.EVENT.UP));
			this.element.addEventListener('mouseleave', this.trigger.bind(this, this.EVENT.UP));
		}
	});
});

define([
	'backbone-Util',
	'jquery-mousewheel'
], function (Util) {

	return Util.extend({

		EVENT: {
			DOWN: 0,
			MOVE: 1,
			UP: 2,
			WHEEL: 3
		},

		initialize: function (element) {

			this.element = element || document;
			this.element.addEventListener('mousedown', this.trigger.bind(this, this.EVENT.DOWN), true);
			this.element.addEventListener('mousemove', this.trigger.bind(this, this.EVENT.MOVE), true);
			this.element.addEventListener('mouseup', this.trigger.bind(this, this.EVENT.UP), true);
			this.element.addEventListener('mouseleave', this.trigger.bind(this, this.EVENT.UP), true);
			$(this.element).on('mousewheel', this.trigger.bind(this, this.EVENT.WHEEL));
		}
	});
});

define(['backbone'], function(Backbone) {

	return Backbone.View.extend({

		tagName: 'canvas',

		render: function($parent) {
			this.$el.appendTo($parent);

			// prevent the zoom behaviour in Chrome
			var noop = function(event) { event.preventDefault(); };
			this.el.addEventListener('touchstart', noop);
			this.el.addEventListener('touchmove', noop);

			return this;
		}
	});
});

define(['backbone'], function(Backbone) {

	return Backbone.View.extend({

		tagName: 'canvas',

		render: function($parent) {
			this.$el.appendTo($parent);
			return this;
		}
	});
});

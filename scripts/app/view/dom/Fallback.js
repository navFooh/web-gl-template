define([
	'templates/fallback',
	'model/AppModel'
], function(template, AppModel) {

	return Backbone.View.extend({

		render: function($parent) {
			this.setElement(template(AppModel.toJSON()));
			this.$el.appendTo($parent);
		}
	});
});
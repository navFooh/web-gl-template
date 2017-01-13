define([
	'backbone',
	'model/AppModel',
	'templates/fallback'
], function(Backbone, AppModel, template) {

	return Backbone.View.extend({

		render: function($parent) {
			this.setElement(template(AppModel.toJSON()));
			this.$el.appendTo($parent);
			return this;
		}
	});
});

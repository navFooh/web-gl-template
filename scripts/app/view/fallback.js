define([
	'backbone',
	'model/app-model',
	'templates/fallback'
], function (Backbone, AppModel, template) {

	return Backbone.View.extend({

		render: function (parent) {
			this.setElement(template(AppModel.toJSON()));
			parent.appendChild(this.el);
			return this;
		}
	});
});

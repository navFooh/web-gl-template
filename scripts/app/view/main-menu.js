define([
	'backbone',
	'templates/main-menu'
], function (Backbone, template) {

	return Backbone.View.extend({

		render: function (parent) {
			this.setElement(template());
			parent.appendChild(this.el);
			return this;
		}
	});
});

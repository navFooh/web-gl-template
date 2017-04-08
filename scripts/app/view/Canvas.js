define([
	'backbone',
	'model/PointerModel'
], function(Backbone, PointerModel) {

	return Backbone.View.extend({

		tagName: 'canvas',

		initialize: function() {
			PointerModel.set({ element: this.el });
		},

		render: function(parent) {
			parent.appendChild(this.el);
			return this;
		}
	});
});

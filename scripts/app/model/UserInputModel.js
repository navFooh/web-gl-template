define([
	'backbone',
	'model/DisplayModel'
], function (Backbone, DisplayModel) {

	var UserInputModel = Backbone.Model.extend({

		defaults: {
			mouseX: 0,
			mouseY: 0,
			normalX: 0,
			normalY: 0
		},

		initialize: function () {
			$(document)
				.on('mousemove', this.onMouseMove.bind(this))
				.on('mousewheel', this.trigger.bind(this, 'wheel'));
		},

		onMouseMove: function(event) {
			this.set({
				mouseX: event.clientX,
				mouseY: event.clientY,
				normalX: event.clientX / (DisplayModel.get('width') * 0.5) - 1,
				normalY: event.clientY / (DisplayModel.get('height') * 0.5) - 1
			}).trigger('move');
		}
	});

	return new UserInputModel();
});

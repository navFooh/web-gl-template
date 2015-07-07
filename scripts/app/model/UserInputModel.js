define(['model/DisplayModel'], function (DisplayModel) {

	var UserInputModel = Backbone.Model.extend({

		defaults: {
			mouseX: 0,
			mouseY: 0
		},

		initialize: function () {
			_.bindAll(this, 'onMouseMove');
			$(document).on('mousemove', this.onMouseMove);
		},

		onMouseMove: function(event) {
			this.set({
				mouseX: event.clientX / (DisplayModel.get('width') * 0.5) - 1,
				mouseY: event.clientY / (DisplayModel.get('height') * 0.5) - 1
			}).trigger('mouseMove');
		}
	});

	return new UserInputModel();
});
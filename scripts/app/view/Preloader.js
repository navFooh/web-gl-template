define([
	'backbone',
	'TweenMax',
	'model/AppModel',
	'templates/preloader'
], function(Backbone, TweenMax, AppModel, template) {

	return Backbone.View.extend({

		render: function($parent) {
			this.setElement(template(AppModel.toJSON()));
			this.$el.appendTo($parent);
		},

		fadeOut: function() {
			TweenMax.to(this.el, 1.2, {
				autoAlpha: 0,
				ease: Power2.easeInOut,
				onComplete: this.remove,
				onCompleteScope: this
			})
		}
	});
});

define([
	'backbone',
	'TweenMax',
	'model/app-model',
	'templates/preloader'
], function (Backbone, TweenMax, AppModel, template) {

	return Backbone.View.extend({

		render: function (parent) {
			this.setElement(template(AppModel.toJSON()));
			parent.appendChild(this.el);
			return this;
		},

		fadeOut: function (callback) {
			TweenMax.to(this.el, 1.2, {
				autoAlpha: 0,
				ease: Power2.easeInOut,
				onComplete: function () {
					this.remove();
					callback();
				}.bind(this)
			})
		}
	});
});

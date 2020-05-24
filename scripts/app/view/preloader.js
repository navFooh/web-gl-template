define([
	'backbone',
	'gsap',
	'model/app-model',
	'view/dots',
	'templates/preloader'
], function (Backbone, gsap, AppModel, Dots, template) {

	return Backbone.View.extend({

		render: function (parent) {
			this.setElement(template(AppModel.toJSON()));
			parent.appendChild(this.el);

			var message = this.el.getElementsByClassName('message')[0];
			this.dots = new Dots().render(message);

			return this;
		},

		remove: function () {
			this.dots.remove();
			delete this.dots;
			Backbone.View.prototype.remove.apply(this);
		},

		fadeOut: function (callback) {
			gsap.gsap.to(this.el, {
				autoAlpha: 0,
				duration: 1.2,
				ease: 'power2.inOut',
				onComplete: callback
			});
		}
	});
});

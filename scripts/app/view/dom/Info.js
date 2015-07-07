define([
	'templates/info',
	'model/AppModel',
	'TweenMax'
], function(template, AppModel, TweenMax) {

	return Backbone.View.extend({

		events: {
			'click': 'onClick'
		},

		overlayOpen: false,
		slideEase: Quint.easeOut,
		slideDuration: 0.6,
		slideOffsetY: 30,

		render: function($parent) {
			this.setElement(template(AppModel.toJSON()));
			this.$el.appendTo($parent);

			this.$overlay = this.$('.overlay');
			this.$slideUp = this.$overlay.find('.slide-up');

			TweenMax.set(this.$overlay, { autoAlpha: 0 });
			TweenMax.set(this.$slideUp, { y: this.slideOffsetY, force3D: true });
		},

		onClick: function(event) {
			var $target = $(event.target),
				isLink = $target.prop("tagName") == 'A';
			if (!isLink) this.toggleOverlay();
		},

		toggleOverlay: function() {
			this.overlayOpen = !this.overlayOpen;
			TweenMax.to(this.$overlay, this.slideDuration, {
				autoAlpha: this.overlayOpen ? 1 : 0,
				ease: this.slideEase
			});
			TweenMax.to(this.$slideUp, this.slideDuration, {
				y: this.overlayOpen ? 0 : this.slideOffsetY,
				ease: this.slideEase
			});
		}
	});
});
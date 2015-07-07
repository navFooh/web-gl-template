define([
	'TweenMax',
	'TimelineMax'
], function (TweenMax, TimelineMax) {

	return Backbone.View.extend({

		tagName: 'p',
		className: 'dots',

		duration: 0.7,
		stagger: 0.2,
		delay: 0.8,

		initialize: function (options) {
			this.message  = options && options.message  ? options.message  : null;
			this.dotCount = options && options.dotCount ? options.dotCount : 3;
		},

		render: function($parent) {
			this.$el.appendTo($parent);

			if (this.message) {
				this.$el.append(this.message)
			}

			_.times(this.dotCount, function() {
				this.$el.append('<span class="dot">.</span>');
			}, this);

			var $dots = this.$('.dot');

			TweenMax.set($dots, { autoAlpha: 0 });

			this.timeline = new TimelineMax({
				repeat: -1,
				delay: this.delay,
				repeatDelay: this.delay
			});

			this.timeline.staggerTo($dots, this.duration, {
				autoAlpha: 1,
				ease: Power1.easeOut
			}, this.stagger);

			this.timeline.to($dots, this.duration, {
				autoAlpha: 0,
				delay: this.delay,
				ease: Power1.easeOut
			});
		},

		destroy: function() {
			if (this.timeline) {
				this.timeline.kill();
				this.timeline = null;
			}
			this.remove();
		}
	});
});
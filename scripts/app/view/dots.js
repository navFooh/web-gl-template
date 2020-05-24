define([
	'backbone',
	'gsap',
	'underscore'
], function (Backbone, gsap, _) {

	return Backbone.View.extend({

		tagName: 'span',

		dotCount: 3,
		duration: 0.3,
		stagger: 0.15,
		delay: 0.3,

		render: function (parent, message) {
			this.el.innerHTML = message || '';
			parent.appendChild(this.el);

			this.createDots();
			this.createTimeline();

			return this;
		},

		createDots: function () {
			this.dots = [];

			_.times(this.dotCount, function () {
				var dot = document.createElement('span');
				dot.innerHTML = '.';
				this.dots.push(dot);
				this.el.appendChild(dot);
			}, this);
		},

		createTimeline: function () {

			this.timeline = gsap.gsap.timeline({
				repeat: -1,
				repeatDelay: this.delay
			});

			// hide all dots initially
			this.timeline.set(this.dots, { autoAlpha: 0 });

			// fade in dots one by one
			this.timeline.to(this.dots, {
				autoAlpha: 1,
				duration: this.duration,
				stagger: this.stagger,
				ease: 'power1'
			});

			// fade out all dots
			this.timeline.to(this.dots, {
				autoAlpha: 0,
				duration: this.duration,
				delay: this.delay,
				ease: 'power1'
			});
		},

		remove: function () {

			// remove dot elements
			_.invoke(this.dots, 'remove');
			delete this.dots;

			// cleanup timeline
			this.timeline.kill();
			delete this.timeline;

			Backbone.View.prototype.remove.apply(this);
		}
	});
});

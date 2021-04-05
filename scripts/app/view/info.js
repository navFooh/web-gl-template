define([
	'backbone',
	'gsap',
	'model/app-model',
	'view/logo',
	'templates/info'
], function (Backbone, gsap, AppModel, Logo, template) {

	return Backbone.View.extend({

		events: {
			click: 'onClick'
		},

		initialize: function () {
			this.listenTo(AppModel, 'change:infoOpen', this.onInfoOpen);
		},

		render: function (parent) {
			this.setElement(template(AppModel.toJSON()));
			parent.appendChild(this.el);

			this.slideOffset = 64;
			this.slideUp = this.el.getElementsByClassName('slide-up')[0];

			this.logo = new Logo().render(this.el);
			this.listenTo(this.logo, 'click', this.onClickLogo);

			this.fadeOut = document.createElement('DIV');
			this.fadeOut.className = 'fade-out';
			this.el.appendChild(this.fadeOut);

			gsap.gsap.set(this.el, { autoAlpha: 0 });
			gsap.gsap.set(this.fadeOut, { autoAlpha: 0 });

			this.addScript('facebook-jssdk', 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.0');
			this.addScript('twitter-wjs', 'https://platform.twitter.com/widgets.js');
			this.addScript('linkedin-js', 'https://platform.linkedin.com/in.js');
			this.addScript('pinterest-js', 'https://assets.pinterest.com/js/pinit.js');

			return this;
		},

		onClick: function (event) {
			if (event.target.tagName != 'A')
				AppModel.set({ infoOpen: false });
		},

		onClickLogo: function (url) {
			this.stopListening();
			this.undelegateEvents();
			gsap.gsap.to(this.fadeOut, {
				autoAlpha: 1,
				duration: 0.3,
				ease: 'power2.out',
				onComplete: function () {
					window.top.location = url;
				}
			});
		},

		onInfoOpen: function () {
			var open = AppModel.get('infoOpen');

			gsap.gsap.to(this.el, {
				autoAlpha: open ? 1 : 0,
				duration: 0.7,
				ease: open ? 'power3.inOut' : 'power4.out',
				onComplete: open ? this.logo.show : this.logo.hide,
				callbackScope: this.logo
			});

			open && gsap.gsap.fromTo(this.slideUp,
				{ y: this.slideOffset },
				{
					y: 0,
					duration: 0.9,
					ease: 'power3.out'
				});
		},

		addScript: function(id, src) {
			if (document.getElementById(id)) return;
			var first = document.getElementsByTagName('script')[0],
				script = document.createElement('script');
			script.id = id;
			script.src = src;
			first.parentNode.insertBefore(script, first);
		}
	});
});

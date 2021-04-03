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

			this.initFacebook();
			this.initTwitter();
			this.createTweetButton();

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

		initFacebook: function () {
			(function (d, s, id) {
				var js, fjs = d.getElementsByTagName(s)[0];
				if (d.getElementById(id)) return;
				js = d.createElement(s); js.id = id;
				js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.0";
				fjs.parentNode.insertBefore(js, fjs);
			}(document, 'script', 'facebook-jssdk'));
		},

		initTwitter: function () {
			window.twttr = (function (d, s, id) {
				var js, fjs = d.getElementsByTagName(s)[0],
					t = window.twttr || {};
				if (d.getElementById(id)) return t;
				js = d.createElement(s);
				js.id = id;
				js.src = "https://platform.twitter.com/widgets.js";
				fjs.parentNode.insertBefore(js, fjs);
				t._e = [];
				t.ready = function (f) {
					t._e.push(f);
				};
				return t;
			}(document, 'script', 'twitter-wjs'));
		},

		createTweetButton: function () {
			window.twttr.ready(function() {
				var url = AppModel.get('metadata').url;
				var el = this.el.getElementsByClassName('tweet-button')[0];
				window.twttr.widgets.createShareButton(url, el);
			}.bind(this));
		}
	});
});

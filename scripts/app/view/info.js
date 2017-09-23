define([
	'backbone',
	'TweenMax',
	'model/app-model',
	'view/logo',
	'templates/info'
], function (Backbone, TweenMax, AppModel, Logo, template) {

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

			TweenMax.set(this.el, { autoAlpha: 0 });
			TweenMax.set(this.fadeOut, { autoAlpha: 0 });
			TweenMax.set(this.slideUp, { force3D: true });

			this.initPlusOne();
			this.initFacebook();
			this.initTwitter();

			return this;
		},

		onClick: function (event) {
			if (event.target.tagName != 'A')
				AppModel.set({ infoOpen: false });
		},

		onClickLogo: function (url) {
			this.stopListening();
			this.undelegateEvents();
			TweenMax.to(this.fadeOut, 0.3, {
				autoAlpha: 1,
				ease: Power2.easeOut,
				onComplete: function () {
					window.top.location = url;
				}
			});
		},

		onInfoOpen: function () {
			var open = AppModel.get('infoOpen');

			TweenMax.to(this.el, 0.7, {
				autoAlpha: open ? 1 : 0,
				ease: open ? Power3.easeInOut : Power4.easeOut,
				onComplete: open ? this.logo.show : this.logo.hide,
				onCompleteScope: this.logo
			});

			open && TweenMax.fromTo(this.slideUp, 0.9,
				{ y: this.slideOffset },
				{ y: 0, ease: Power3.easeOut });
		},

		initPlusOne: function () {
			window.___gcfg = { lang: 'en-GB' };
			(function () {
				var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
				po.src = 'https://apis.google.com/js/platform.js';
				var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
			})();
		},

		initFacebook: function () {
			(function (d, s, id) {
				var js, fjs = d.getElementsByTagName(s)[0];
				if (d.getElementById(id)) return;
				js = d.createElement(s); js.id = id;
				js.src = "//connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v2.8";
				fjs.parentNode.insertBefore(js, fjs);
			}(document, 'script', 'facebook-jssdk'));
		},

		initTwitter: function () {
			window.twttr = (function (d, s, id) {
				var js, fjs = d.getElementsByTagName(s)[0],
					t = window.twttr || {};
				if (d.getElementById(id)) return t;
				js = d.createElement(s); js.id = id;
				js.src = "https://platform.twitter.com/widgets.js";
				fjs.parentNode.insertBefore(js, fjs); t._e = [];
				t.ready = function (f) { t._e.push(f); };
				return t;
			}(document, 'script', 'twitter-wjs'));
		}
	});
});

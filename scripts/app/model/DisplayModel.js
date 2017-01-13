define(['backbone'], function (Backbone) {

	var DisplayModel = Backbone.Model.extend({

			defaults: {
				width: 0,
				height: 0,
				aspect: 1
			},

			initialize: function () {
				this.onResize();
				window.addEventListener('resize', this.onResize.bind(this));
				this.on('resize', _.debounce(_.partial(this.trigger, 'resizeStart'), 250, true));
				this.on('resize', _.debounce(_.partial(this.trigger, 'resizeEnd'), 250));
			},

			onResize: function () {
				this.set({
					width: window.innerWidth,
					height: window.innerHeight,
					aspect: window.innerWidth / window.innerHeight
				}).trigger('resize');
			}
		});

	return new DisplayModel();
});

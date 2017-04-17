define([
	'backbone',
	'underscore'
], function (Backbone, _) {

	var DisplayModel = Backbone.Model.extend({

		defaults: {
			width: 0,
			height: 0,
			aspect: 1,
			fontSize: 16,
			lineHeight: 24
		},

		initialize: function () {
			this.onResize();
			this.setStyles();

			window.addEventListener('resize', this.onResize.bind(this));

			this.on('resize', _.debounce(_.partial(this.trigger, 'resizeStart'), 250, true));
			this.on('resize', _.debounce(_.partial(this.trigger, 'resizeEnd'), 250));
		},

		setStyles: function () {
			var style = window.getComputedStyle(document.body, null),
				fontSize = style.getPropertyValue('font-size'),
				lineHeight = style.getPropertyValue('line-height');
			this.set({
				fontSize: parseFloat(fontSize) || 16,
				lineHeight: parseFloat(lineHeight) || 24
			});
		},

		onResize: function () {
			var width = window.innerWidth,
				height = window.innerHeight;
			this.set({
				width: width,
				height: height,
				aspect: width / height,
				diagonal: Math.sqrt(width * width + height * height)
			}).trigger('resize');
		}
	});

	return new DisplayModel();
});

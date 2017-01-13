define([
	'app/AppBase',
	'model/AssetModel',
	'model/WebGLModel',
	'view/Canvas',
	'view/Preloader',
	'webgl/Engine'
], function (AppBase, AssetModel, WebGLModel, Canvas, Preloader, Engine) {

	return AppBase.extend({

		createViews: function() {
			this.canvas = new Canvas().render('body');
			this.preloader = new Preloader().render('body');
		},

		createWebGL: function() {
			new Engine({ el: this.canvas.el });
		},

		start: function() {
			AssetModel.get('loading')
				? this.listenToOnce(AssetModel, 'change:loading', this.run)
				: this.run();
		},

		run: function() {
			WebGLModel.start();
			this.preloader.fadeOut();
		}
	});
});

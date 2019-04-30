define([
	'app/app-base',
	'model/app-model',
	'model/asset-model',
	'model/webgl-model',
	'view/canvas',
	'view/preloader',
	'webgl/engine'
], function (AppBase, AppModel, AssetModel, WebGLModel, Canvas, Preloader, Engine) {

	return AppBase.extend({

		createViews: function () {
			this.canvas = new Canvas().render(document.body);
			this.preloader = new Preloader().render(document.body);
			AppModel.get('dev') && document.body.appendChild(WebGLModel.createStats());
		},

		createWebGL: function () {
			new Engine({ canvas: this.canvas.el });
		},

		start: function () {
			AssetModel.get('loading')
				? this.listenToOnce(AssetModel, 'change:loading', this.run)
				: this.run();
		},

		run: function () {
			WebGLModel.start();
			this.preloader.fadeOut(function () {
				this.preloader.remove();
				delete this.preloader;
			}.bind(this));
		}
	});
});

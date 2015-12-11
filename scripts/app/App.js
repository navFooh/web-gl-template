define([
	'model/AppModel',
	'view/world/World',
	'view/dom/Info',
	'view/dom/Fallback'
], function (AppModel, World, Info, Fallback) {

	return new function() {

		var loadExperiment = function() {
				new World().render('body');
				new Info().render('body');
			},

			loadFallback = function() {
				new Fallback().render('body');
			};

		this.initialize = function() {
			AppModel.isSupported() ? loadExperiment() : loadFallback();
		}
	};
});

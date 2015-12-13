define([
	'model/AppModel',
	'view/world/World',
	'view/dom/Fallback'
], function (AppModel, World, Fallback) {

	return new function() {

		var loadExperiment = function() {
				new World().render('body');
			},

			loadFallback = function() {
				new Fallback().render('body');
			};

		this.initialize = function() {
			AppModel.isSupported() ? loadExperiment() : loadFallback();
		}
	};
});

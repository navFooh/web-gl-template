define([
	// models
	'model/AppModel',
	// views
	'view/scene/Scene',
	'view/dom/Info',
	'view/dom/fallback/Fallback'
], function (
	// models
	AppModel,
	// views
	Scene,
	Info,
	Fallback
	) {

	return new function() {

		var loadExperiment = function() {
				new Scene({ $parent: 'body' });
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
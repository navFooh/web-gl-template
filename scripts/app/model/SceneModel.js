define(function () {

	var SceneModel = Backbone.Model.extend({

		defaults: {
			scene: null,
			camera: null,
			delta: 0,
			elapsed: 0
		}
	});

	return new SceneModel();
});

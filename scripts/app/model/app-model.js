define([
	'backbone',
	'util/detector',
	'json!../../../metadata.json'
], function (Backbone, Detector, metadata) {

	var AppModel = Backbone.Model.extend({

		defaults: {
			metadata: metadata,
			dev: document.body.hasAttribute('data-dev')
		},

		isSupported: function () {
			return Detector.webgl;
		}
	});

	return new AppModel();
});

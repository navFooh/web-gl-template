define([
	'json!../../../metadata.json',
	'util/Detector'
], function (metadata, Detector) {

	var AppModel = Backbone.Model.extend({

		defaults: {
			metadata: metadata,
			dev: $('body').hasClass('dev')
		},

		isSupported: function() {
			return Detector.webgl;
		}
	});

	return new AppModel();
});
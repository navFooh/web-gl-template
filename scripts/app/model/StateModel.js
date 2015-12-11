define([
	'model/AppModel',
	'util/Loader'
], function (AppModel, Loader) {

	var StateModel = Backbone.Model.extend({

		defaults: {
			loading: false
		},

		initialize: function() {
			var dev = AppModel.get('dev');
			if (dev) this.on('change', function() {
				console.log('StateModel', this.changed);
			});
		},

		startLoading: function() {
			this.set({ loading: true });
			var onProgress = _.bind(this.trigger, this, 'loaderProgress'),
				onFinished = _.bind(this.set, this, { loading: false });
			Loader.startBatch(onFinished, onProgress);
		}
	});

	return new StateModel();
});

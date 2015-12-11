define(['util/Loader'], function (Loader) {

	var StateModel = Backbone.Model.extend({

		defaults: {
			loading: false
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

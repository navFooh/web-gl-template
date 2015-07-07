define(['util/Loader'], function (Loader) {

	var StateModel = Backbone.Model.extend({

		defaults: {
			loading: false
		},

		initialize: function() {
			_.bindAll(this, 'onLoaderProgress', 'onLoaderFinished');
		},

		startLoading: function() {
			this.set({ loading: true });
			Loader.startBatch(this.onLoaderFinished, this.onLoaderProgress);
		},

		onLoaderProgress: function(loaded, total) {
			this.trigger('loader:progress', loaded, total)
		},

		onLoaderFinished: function() {
			this.trigger('loader:finished');
			this.set({ loading: false });
		}
	});

	return new StateModel();
});
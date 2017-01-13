define([
	'backbone',
	'underscore'
], function(Backbone, _) {

	var App = function(options) {
		this.createViews.apply(this, arguments);
		this.createWebGL.apply(this, arguments);
		this.createModels.apply(this, arguments);
		this.createRouters.apply(this, arguments);
		this.addListeners();
		this.start();
	};

	_.extend(App.prototype, Backbone.Events, {
		createViews: function() {},
		createWebGL: function() {},
		createModels: function() {},
		createRouters: function() {},
		addListeners: function() {},
		start: function() {}
	});

	App.extend = Backbone.Model.extend;

	return App;
});

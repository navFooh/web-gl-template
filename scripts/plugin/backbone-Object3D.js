define(['backbone'], function(Backbone) {

	var Object3D = Backbone.Object3D = function(options) {
		this.cid = _.uniqueId('object3d');
		options || (options = {});
		_.extend(this, _.pick(options, ['model', 'collection']));
		this.initialize.apply(this, arguments);
	};

	_.extend(Object3D.prototype, Events, {

		initialize: function(){},

		render: function() {
			return this;
		},

		remove: function() {
			this.stopListening();
			return this;
		}
	});

	return Object3D;

});

define([
	'model/SceneModel',
	'three'
], function(SceneModel, THREE) {

	return Backbone.View.extend({

		light: null,

		initialize: function () {
			this.autoBind();
			this.createLight();
		},

		createLight: function () {
			this.light = new THREE.AmbientLight(0x404040);
			SceneModel.get('scene').add(this.light);
		}
	});
});
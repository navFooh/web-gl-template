define([
	'backbone-WebGL',
	'model/WebGLModel',
	'webgl/core/Scene',
	'webgl/core/Camera',
	'webgl/core/Renderer'
], function(WebGL, WebGLModel, Scene, Camera, Renderer) {

	return WebGL.extend({

		initialize: function(options) {

			WebGLModel.set({
				scene: new Scene(),
				camera: new Camera(),
				renderer: new Renderer(options.canvas)
			});
		}
	});
});

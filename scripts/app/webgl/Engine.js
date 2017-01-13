define([
	'backbone-WebGL',
	'model/WebGLModel',
	'webgl/core/Camera',
	'webgl/core/Renderer',
	'webgl/scene/Scene'
], function(WebGL, WebGLModel, Camera, Renderer, Scene) {

	return WebGL.extend({

		initialize: function(options) {

			WebGLModel.set({
				scene: new Scene(),
				camera: new Camera(),
				renderer: new Renderer({ canvas: options.canvas })
			});
		}
	});
});

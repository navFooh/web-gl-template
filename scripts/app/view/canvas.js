define([
	'backbone',
	'model/pointer-model',
	'model/webgl-model'
], function (Backbone, PointerModel, WebGLModel) {

	return Backbone.View.extend({

		tagName: 'canvas',

		initialize: function () {
			PointerModel.set({ element: this.el });
			this.listenTo(WebGLModel, 'change:cursorStyle', this.onChangeCursorStyle);
		},

		render: function (parent) {
			parent.appendChild(this.el);
			return this;
		},

		onChangeCursorStyle: function (model, cursorStyle) {
			this.el.style.cursor = cursorStyle;
		}
	});
});

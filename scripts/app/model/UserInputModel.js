define([
	'backbone',
	'model/DisplayModel'
], function (Backbone, DisplayModel) {

	var UserInputModel = Backbone.Model.extend({

		defaults: {
			mouseX: 0,
			mouseY: 0,
			normalX: 0,
			normalY: 0,
			altDown: false,
			ctrlDown: false,
			shiftDown: false
		},

		initialize: function () {
			$(document)
				.on('contextmenu', this.onContextMenu)
				.on('keyup', this.onKeyUp.bind(this))
				.on('keydown', this.onKeyDown.bind(this))
				.on('mousemove', this.onMouseMove.bind(this))
				.on('mouseup', this.trigger.bind(this, 'mouseup'))
				.on('mousedown', this.trigger.bind(this, 'mousedown'))
				.on('mouseleave', this.trigger.bind(this, 'mouseleave'))
				.on('mousewheel', this.trigger.bind(this, 'mousewheel'));
		},

		onContextMenu: function(event) {
			event.preventDefault();
		},

		onMouseMove: function(event) {
			var mouseX = this.get('mouseX'),
				mouseY = this.get('mouseY');
			this.set({
				mouseX: event.clientX,
				mouseY: event.clientY,
				normalX: event.clientX / (DisplayModel.get('width') * 0.5) - 1,
				normalY: event.clientY / (DisplayModel.get('height') * 0.5) - 1
			}).trigger('mousemove', this.get('mouseX') - mouseX, this.get('mouseY') - mouseY);
		},

		onKeyDown: function(event) {
			switch(event.which) {
				case 9:
					event.preventDefault();
					this.trigger('tab');
					break;
				case 13: this.trigger('enter'); break;
				case 27: this.trigger('escape'); break;
				case 32: this.trigger('space'); break;
				case 65: // A
				case 37: this.trigger('left'); break;
				case 87: // W
				case 38: this.trigger('up'); break;
				case 68: // D
				case 39: this.trigger('right'); break;
				case 83: // S
				case 40: this.trigger('down'); break;
				case 16: this.set({ shiftDown: true }); break;
				case 17: this.set({ ctrlDown: true }); break;
				case 18: this.set({ altDown: true }); break;
			}
		},

		onKeyUp: function(event) {
			switch(event.which) {
				case 16: this.set({ shiftDown: false }); break;
				case 17: this.set({ ctrlDown: false }); break;
				case 18: this.set({ altDown: false }); break;
			}
		}
	});

	return new UserInputModel();
});

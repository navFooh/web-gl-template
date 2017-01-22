define([
	'backbone',
	'three',
	'model/DisplayModel',
	'jquery-mousewheel'
], function (Backbone, THREE, DisplayModel) {

	var UserInputModel = Backbone.Model.extend({

		defaults: {
			altDown: false,
			ctrlDown: false,
			shiftDown: false,
			pinching: false,
			pinchStart: 0,
			pinchScale: 1,
			pointerX: 0,
			pointerY: 0,
			normalX: 0,
			normalY: 0
		},

		initialize: function () {
			$(document)
				.on('contextmenu', this.onContextMenu)

				.on('keydown', this.onKeyDown.bind(this))
				.on('keyup', this.onKeyUp.bind(this))

				.on('touchstart', this.onTouchStart.bind(this))
				.on('touchmove', this.onTouchMove.bind(this))
				.on('touchend', this.onTouchEnd.bind(this))

				.on('mousedown', this.onPointerDown.bind(this))
				.on('mousemove', this.onPointerMove.bind(this))
				.on('mouseup', this.onPointerUp.bind(this))
				.on('mouseleave', this.onPointerUp.bind(this))

				.on('mousewheel', this.trigger.bind(this, 'mousewheel'));
		},

		// Prevent Context Menu

		onContextMenu: function(event) {
			event.preventDefault();
		},

		// Keyboard Events

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
		},

		// Touch Events

		onTouchStart: function(event) {
			this.setPinching(event.touches);
			this.setPointerPosition(this.getAverageTouch(event.touches));
			event.touches.length == 1 && this.onPointerDown({ button: 0 });
			event.preventDefault();
		},

		onTouchMove: function(event) {
			this.onPointerMove(this.getAverageTouch(event.touches));
			this.get('pinching') && this.movePinch(event.touches);
			event.preventDefault();
		},

		onTouchEnd: function(event) {
			this.setPinching(event.touches);
			event.touches.length == 0 && this.onPointerUp({ button: 0 });
			event.preventDefault();
		},

		setPinching: function(touches) {
			var pinching = touches.length == 2;
			if (pinching && !this.get('pinching')) this.startPinch(touches);
			if (!pinching && this.get('pinching')) this.set({ pinching: false });

		},

		startPinch: function(touches) {
			this.set({
				pinching: true,
				pinchStart: this.getPinchLength(touches),
				pinchScale: 1
			})
		},

		movePinch: function(touches) {
			var prev = this.get('pinchScale'),
				start = this.get('pinchStart'),
				length = this.getPinchLength(touches);
			this.set({ pinchScale: length / start });
			this.trigger('pinch', { delta: this.get('pinchScale') - prev });
		},

		getPinchLength: function() {
			var pinchA = new THREE.Vector2(),
				pinchB = new THREE.Vector2();
			return function(touches) {
				pinchA.x = touches[0].clientX;
				pinchA.y = touches[0].clientY;
				pinchB.x = touches[1].clientX;
				pinchB.y = touches[1].clientY;
				return pinchA.sub(pinchB).length();
			}
		}(),

		getAverageTouch: function() {
			var add = function(a, b) { return a + b };
			return function(touches) {
				return {
					clientX: _.reduce(_.pluck(touches, 'clientX'), add) / touches.length,
					clientY: _.reduce(_.pluck(touches, 'clientY'), add) / touches.length
				}
			}
		}(),

		// Pointer Events

		onPointerDown: function(event) {
			this.trigger('pointerdown', event);
		},

		onPointerMove: function(event) {
			var prevX = this.get('pointerX'),
				prevY = this.get('pointerY');
			this.setPointerPosition(event);
			this.trigger('pointermove', {
				deltaX: this.get('pointerX') - prevX,
				deltaY: this.get('pointerY') - prevY
			});
		},

		onPointerUp: function(event) {
			this.trigger('pointerup', event);
		},

		setPointerPosition: function(event) {
			this.set({
				pointerX: event.clientX,
				pointerY: event.clientY,
				normalX: event.clientX / (DisplayModel.get('width') * 0.5) - 1,
				normalY: event.clientY / (DisplayModel.get('height') * 0.5) - 1
			})
		}
	});

	return new UserInputModel();
});

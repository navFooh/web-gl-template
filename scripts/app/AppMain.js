define([
	'app/AppBase',
	'webgl/World'
], function (AppBase, World) {

	return AppBase.extend({

		createViews: function() {
			new World().render('body');
		},

		start: function() {

		}
	});
});

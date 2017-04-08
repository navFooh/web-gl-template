define([
	'app/AppBase',
	'view/Fallback'
], function (AppBase, Fallback) {

	return AppBase.extend({

		createViews: function() {
			new Fallback().render(document.body);
		}
	});
});

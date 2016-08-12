define(['underscore'], function(_) {

	return {

		loadList: function(context, urls, callback, onProgress) {

			var buffers = [],
				loaded = 0;

			_.each(urls, function(url, index) {

				var onLoad = function(buffer) {
					buffers[index] = buffer;
					if (++loaded == urls.length) {
						callback(buffers);
					}
					onProgress();
				};

				this.load(context, url, onLoad);

			}, this);
		},

		load: function(context, url, callback) {

			var request = new XMLHttpRequest(),
				onLoad = function() {
					context.decodeAudioData(request.response, decode, onError);
				},
				decode = function(buffer) {
					buffer ? callback(buffer) : onError('error decoding audio');
				},
				onError = function(error) {
					console.error('BufferLoader error for ' + url + ': ' + error);
				};

			request.open('GET', url, true);
			request.responseType = 'arraybuffer';
			request.onload = onLoad;
			request.onerror = onError;
			request.send();
		}
	};
});

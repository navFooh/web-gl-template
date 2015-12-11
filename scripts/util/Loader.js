define([
	'three',
	'underscore',
	'util/BufferLoader',
	'three-OBJLoader'
], function(THREE, _, BufferLoader) {

	var batching = false,
		loaded = 0,
		total = 0,

		callbacks = {
			onFinished: null,
			onProgress: null
		},

		objLoader = new THREE.OBJLoader(),
		jsonLoader = new THREE.JSONLoader(),
		imageLoader = new THREE.ImageLoader(),

		checkBatch = function() {
			if (total == 0) {
				console.warn('Loader -> no items added, aborting load');
				onFinished();
			}
		},

		onLoad = function() {
			this.apply(this, arguments);
			onProgress();
		},

		onProgress = function() {
			if (batching) {
				callbacks.onProgress(++loaded, total);
				if (loaded == total) onFinished();
			}
		},

		onFinished = function() {
			batching = false;
			callbacks.onFinished();
		};

	return {

		startBatch: function(onFinished, onProgress) {
			callbacks.onFinished = onFinished ? onFinished : function() {};
			callbacks.onProgress = onProgress ? onProgress : function() {};
			batching = true;
			loaded = 0;
			total = 0;
			_.defer(checkBatch);
		},

		loadObj: function(url, callback) {
			batching && total++;
			objLoader.load(url, onLoad.bind(callback));
		},

		loadJSON: function(url, callback, texturePath) {
			batching && total++;
			jsonLoader.load(url, onLoad.bind(callback), texturePath);
		},

		loadImage: function(url, callback) {
			batching && total++;
			imageLoader.load(url, onLoad.bind(callback));
		},

		loadTexture: function(url, mapping) {
			batching && total++;
			return THREE.ImageUtils.loadTexture(url, mapping, onProgress);
		},

		loadTextureCube: function(urls, mapping) {
			batching && total++;
			return THREE.ImageUtils.loadTextureCube(urls, mapping, onProgress);
		},

		loadAudioList: function(context, urls, callback) {
			batching && (total += urls.length);
			BufferLoader.loadList(context, urls, callback, onProgress);
		},

		loadAudio: function(context, url, callback) {
			batching && total++;
			BufferLoader.load(context, url, onLoad.bind(callback));
		}
	};
});

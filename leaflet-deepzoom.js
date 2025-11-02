/*
 * Leaflet-DeepZoom 2.0.2
 * Displaying DeepZoom tiles with Leaflet 1.x
 * by Al Farisi, Indokreatif Teknologi
 * https://github.com/alfarisi/leaflet-deepzoom
 */

L.TileLayer.DeepZoom = L.TileLayer.extend({
	options: {
		width: -1,
		height: -1,
		imageFormat: 'jpg',
		tileSize: 256,
		overlap: 0,
		minZoom: 0,
		maxZoom: undefined
	},

	initialize: function (url, options) {
		options = L.setOptions(this, options);
		this._url = url;
		
		if (options.width < 0 || options.height < 0) {
			throw new Error("The user must set the Width and Height of the image");
		}
		
		var imageSize = L.point(options.width, options.height),
			tileSize = options.tileSize;

		//this._overlap = options.overlap || 0;
		this._imageSize = [imageSize];
		this._gridSize = [this._getGridSize(imageSize)];
		
		while (imageSize.x > 0 || imageSize.y > 0) {
			imageSize = imageSize.divideBy(2).floor();
			this._imageSize.push(imageSize);
			this._gridSize.push(this._getGridSize(imageSize));
		}

		this._imageSize.reverse();
		this._gridSize.reverse();

		options.minNativeZoom = 1;
		options.maxNativeZoom = this._gridSize.length - 1;
		
		if (typeof options.minZoom == 'undefined') {
			options.minZoom = 0;
		}
		
		if (typeof options.maxZoom == 'undefined') {
			options.maxZoom = options.maxNativeZoom;
		}
	},

	onAdd: function (map) {
		// Calculate bounds using the actual map instance
		var options = this.options;
		var southWest = map.unproject([0, options.height], options.maxNativeZoom);
		var northEast = map.unproject([options.width, 0], options.maxNativeZoom);
		this.options.bounds = new L.LatLngBounds(southWest, northEast);
		
		// Call parent onAdd
		L.TileLayer.prototype.onAdd.call(this, map);
	},

	_getGridSize: function (imageSize) {
		var tileSize = this.options.tileSize;
		return L.point(Math.ceil(imageSize.x / tileSize), Math.ceil(imageSize.y / tileSize));
	},

	_addTile: function (coords, container) {
		var tilePos = this._getTilePos(coords),
			key = this._tileCoordsToKey(coords);

		var tile = this.createTile(this._wrapCoords(coords), L.bind(this._tileReady, this, coords));
		
		this._initTile(tile);
		
		var zoomForUrl = this._getZoomForUrl(),
			imageSize = this._imageSize[zoomForUrl],
			gridSize = this._gridSize[zoomForUrl],
			tileSize = this.options.tileSize
			overlap = this.options.overlap;

		// Calculate base tile dimensions (accounting for last tile edge case)
		var tileWidth = (coords.x === gridSize.x - 1) ? imageSize.x - (tileSize * (gridSize.x - 1)) : tileSize;
		var tileHeight = (coords.y === gridSize.y - 1) ? imageSize.y - (tileSize * (gridSize.y - 1)) : tileSize;

		// Add overlap for display (first tile: +1 side, middle tiles: +2 sides)
		if (coords.x === 0) {
			tile.style.width = tileWidth + overlap + 'px';
		} else {
			tile.style.width = tileWidth + 2 * overlap + 'px';
			tilePos.x -= overlap;
		}

		if (coords.y === 0) {
			tile.style.height = tileHeight + overlap + 'px';
		} else {
			tile.style.height = tileHeight + 2 * overlap + 'px';
			tilePos.y -= overlap;
		}
		
		if (this.createTile.length < 2) {
			L.Util.requestAnimFrame(L.bind(this._tileReady, this, coords, null, tile));
		}

		L.DomUtil.setPosition(tile, tilePos);

		this._tiles[key] = {
			el: tile,
			coords: coords,
			current: true
		};

		container.appendChild(tile);
		this.fire('tileloadstart', {
			tile: tile,
			coords: coords
		});
	},

	getTileUrl: function(tilePoint) {
		var zoom = this._getZoomForUrl();
		zoom = Math.max(0, Math.min(zoom, this._gridSize.length - 1));
		return this._url + zoom + '/' + tilePoint.x + '_' + tilePoint.y + '.' + this.options.imageFormat;
	}

});

L.tileLayer.deepzoom = function (url, options) {
	return new L.TileLayer.DeepZoom(url, options);
};

/*
 * Leaflet-DeepZoom 2.0.0
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

		// Calculate actual tile dimensions (without overlap first)
		var actualTileWidth = tileSize;
		var actualTileHeight = tileSize;

		if (coords.x === gridSize.x - 1) {
			actualTileWidth = imageSize.x - (tileSize * (gridSize.x - 1));
		} 

		if (coords.y === gridSize.y - 1) {
			actualTileHeight = imageSize.y - (tileSize * (gridSize.y - 1));
		}

		// Add overlap to display dimensions
		var displayWidth = actualTileWidth;
		var displayHeight = actualTileHeight;

		if (overlap > 0) {
			// Add overlap on right if not the last column
			if (coords.x < gridSize.x - 1) {
				displayWidth += overlap;
			}
			// Add overlap on left if not the first column
			if (coords.x > 0) {
				displayWidth += overlap;
			}
			
			// Add overlap on bottom if not the last row
			if (coords.y < gridSize.y - 1) {
				displayHeight += overlap;
			}
			// Add overlap on top if not the first row
			if (coords.y > 0) {
				displayHeight += overlap;
			}
		}

		// Set tile display size
		tile.style.width = displayWidth + 'px';
		tile.style.height = displayHeight + 'px';

		// Adjust position to account for overlap
		if (overlap > 0 && (coords.x > 0 || coords.y > 0)) {
			var adjustedPos = L.point(
				tilePos.x - (coords.x > 0 ? overlap : 0),
				tilePos.y - (coords.y > 0 ? overlap : 0)
			);
			L.DomUtil.setPosition(tile, adjustedPos);
		} else {
			L.DomUtil.setPosition(tile, tilePos);
		}
		
		if (this.createTile.length < 2) {
			L.Util.requestAnimFrame(L.bind(this._tileReady, this, coords, null, tile));
		}

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
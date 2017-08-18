/*
 * Leaflet-DeepZoom 1.0.1
 * Displaying DeepZoom tiles with Leaflet 0.7.x
 * by Al Farisi, Indokreatif Teknologi
 * https://github.com/alfarisi/leaflet-deepzoom
 */

L.TileLayer.DeepZoom = L.TileLayer.extend({
	options: {
		tolerance: 0.8,
		imageFormat: 'jpg'
	},

	initialize: function (url, options) {
		var options = L.setOptions(this, options);
		this._url = url;

    	var imageSize = L.point(options.width, options.height),
	    	tileSize = options.tileSize;

    	this._imageSize = [imageSize];
    	this._gridSize = [this._getGridSize(imageSize)];
		
		while (imageSize.x > 0 || imageSize.y > 0) {
			imageSize = imageSize.divideBy(2).floor();
        	this._imageSize.push(imageSize);
        	this._gridSize.push(this._getGridSize(imageSize));
        }

		this._imageSize.reverse();
		this._gridSize.reverse();

        this.options.maxZoom = this._gridSize.length - 1;
	},

	/*onAdd: function (map) {
		L.TileLayer.prototype.onAdd.call(this, map);

		var mapSize = map.getSize(),
			zoom = this._getBestFitZoom(mapSize),
			imageSize = this._imageSize[zoom],
			center = map.options.crs.pointToLatLng(L.point(imageSize.x / 2, imageSize.y / 2), zoom);

		map.setView(center, zoom, true);
	},*/

	_getGridSize: function (imageSize) {
		var tileSize = this.options.tileSize;
		return L.point(Math.ceil(imageSize.x / tileSize), Math.ceil(imageSize.y / tileSize));
	},

	/*_getBestFitZoom: function (mapSize) {
		var tolerance = this.options.tolerance,
			zoom = this._imageSize.length - 1,
			imageSize, zoom;

		while (zoom) {
			imageSize = this._imageSize[zoom];
			if (imageSize.x * tolerance < mapSize.x && imageSize.y * tolerance < mapSize.y) {
				return zoom;
			}			
			zoom--;
		}

		return zoom;
	},*/

	/*_addTile: function (tilePoint, container) {
		var tilePos = this._getTilePos(tilePoint),
			tile = this._getTile(),
			zoom = this._map.getZoom(),
			imageSize = this._imageSize[zoom],
			gridSize = this._gridSize[zoom],
			tileSize = this.options.tileSize;

		if (tilePoint.x === gridSize.x - 1) {
			tile.style.width = imageSize.x - (tileSize * (gridSize.x - 1)) + 'px';
		} 

		if (tilePoint.y === gridSize.y - 1) {
			tile.style.height = imageSize.y - (tileSize * (gridSize.y - 1)) + 'px';			
		}

		L.DomUtil.setPosition(tile, tilePos, L.Browser.chrome || L.Browser.android23);

		this._tiles[tilePoint.x + ':' + tilePoint.y] = tile;
		this._loadTile(tile, tilePoint);

		if (tile.parentNode !== this._tileContainer) {
			container.appendChild(tile);
		}
	},*/
	_addTile: function (coords, container) {
		//Load the tile via the original leaflet code
		L.TileLayer.prototype._addTile.call(this, coords, container);
		//Get out imagesize in pixels for this zoom level and our grid size
		var imageSize = this._imageSize[this._getZoomForUrl()],
			gridSize = this._gridSize[this._getZoomForUrl()];

		//The real tile size (default:256) and the display tile size (if zoom > maxNativeZoom)
		var	realTileSize = L.GridLayer.prototype.getTileSize.call(this),
			displayTileSize = L.TileLayer.prototype.getTileSize.call(this);

		//Get the current tile to adjust
		var key = this._tileCoordsToKey(coords),
			tile = this._tiles[key].el;

		//Calculate the required size of the border tiles
		var scaleFactor = L.point(	(imageSize.x % realTileSize.x),
									(imageSize.y % realTileSize.y)).unscaleBy(realTileSize);

		//Update tile dimensions if we are on a border
		if ((imageSize.x % realTileSize.x) > 0 && coords.x === gridSize.x - 1) {
			tile.style.width = displayTileSize.scaleBy(scaleFactor).x + 'px';
		}

		if ((imageSize.y % realTileSize.y) > 0 && coords.y === gridSize.y - 1) {
			tile.style.height = displayTileSize.scaleBy(scaleFactor).y + 'px';
		}
	},

	getTileUrl: function(tilePoint) {
		//return this._url + this._map.getZoom() + '/' + tilePoint.x + '_' + tilePoint.y + '.' + this.options.imageFormat;
		return this._url + this._getZoomForUrl() + '/' + tilePoint.x + '_' + tilePoint.y + '.' + this.options.imageFormat;
	}

});

L.tileLayer.deepzoom = function (url, options) {
	return new L.TileLayer.DeepZoom(url, options);
};
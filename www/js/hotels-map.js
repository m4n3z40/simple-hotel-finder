window.HotelsMap = (function() {
	var mapTilesLayerUrl = 'https://{s}.tiles.mapbox.com/v4/{mapID}/{z}/{x}/{y}.png',
        defaultOptions = {
        	mapBoxAccessToken: 'sk.eyJ1IjoibTRuM3o0MCIsImEiOiJaTTAyU1hrIn0.0sZj48IpzxjlR6CRicDI6A',
        	mapBoxMapID: 'm4n3z40.le4nfk8l',
        	defaultLatLng: [-22.9112728, -43.4484478], //Rio de janeiro
        	hotelIcon: L.icon({
	            iconUrl: 'img/hotel-marker-icon.png',
	            iconSize:     [25, 41], // size of the icon
	            iconAnchor:   [12.5, 41], // point of the icon which will correspond to marker's location
	            popupAnchor:  [-3, -43] // point from which the popup should open relative to the iconAnchor
	        }),
        	mapElementID: 'hotelsMap',
        	onLocationChangeHandler: emptyFn,
        	onLocationErrorHandler: emptyFn,
        	onHotelClickHandler: emptyFn
        };

    /**
     * An empty function
     *
     * @return {void}
     */
    function emptyFn() {}

    /**
     * Wrapper for the map behaviors
     *
     * @class
     * @param {Object} options
     */
    function HotelsMap(options) {
		this.options = $.extend({}, defaultOptions, options);

		this.map = null;
		this.latLng = null;
		this.userMarker = null;
		this.foundHotels = null;
		this.hotelMarkers = null;
	}

	/**
	 * Inicializes the map on the screen
	 *
	 * @return {void}
	 */
	HotelsMap.prototype.initialize = function() {
		var options = this.options,
			mapTilesUrl = mapTilesLayerUrl.replace('{mapID}', options.mapBoxMapID);

        this.map = L.map(options.mapElementID, {
            center: options.defaultLatLng,
            zoom: 8,
            zoomControl: false
        });

        L.control.zoom({ position:'bottomleft' }).addTo(this.map);

        var tileLayer = L.tileLayer(mapTilesUrl + '?access_token=' + options.mapBoxAccessToken, {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
						 '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; ' +
						 '<a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18
        });

        this.map.addLayer(tileLayer);
    };

    /**
     * Adds a list of hotels as markers on the map
     *
     * @param {Array} hotels
     */
    HotelsMap.prototype.addHotelsToMap = function(hotels) {
        this.foundHotels = hotels;
        this.hotelMarkers = [];

        var markers = new L.MarkerClusterGroup({
            showCoverageOnHover: false
        });

        this.foundHotels.forEach((function(hotel) {
            var marker = L.marker([parseFloat(hotel.latitude), parseFloat(hotel.longitude)], {icon: this.options.hotelIcon});

            marker.on('click', this.options.onHotelClickHandler.bind(window, hotel, marker));

            this.hotelMarkers.push(marker);
            markers.addLayer(marker);
        }).bind(this));

        this.map.addLayer(markers);
    };

    /**
     * Starts watching the position of the user
     *
     * @param  {Function} onSuccess
     * @param  {Function} onError
     * @return {void}
     */
    HotelsMap.prototype.startWatchingLocation = function(onSuccess, onError) {
    	if (typeof onSuccess === 'function') {
    		this._tempLocationChangeHandler = onSuccess;
    	}

    	if (typeof onError === 'function') {
    		this._tempLocationErrorHandler = onError;
    	}

        navigator.geolocation.watchPosition(
        	this._onPositionChange.bind(this),
        	this._onPositionError.bind(this),
        	{
	            enableHighAccuracy: true,
	            timeout: 30000 //30s
	        }
	    );
    };

	/**
	 * Center view on user's position
	 *
	 * @return {void}
	 */
	HotelsMap.prototype.centerOnUserPosition = function() {
		this.map.setView(this.latLng, 14);
	};

    /**
     * Handler for a position change, updates the user pin on the map and fires the locationChange event
     *
     * @param  {Object} position
     * @return {void}
     */
    HotelsMap.prototype._onPositionChange = function(position) {
    	var lastLatLng = this.latLng;

        this.latLng = [position.coords.latitude, position.coords.longitude];

        this._updateUserPosition();
        this.options.onLocationChangeHandler(this.latLng, lastLatLng);

        if (this._tempLocationChangeHandler) {
        	this._tempLocationChangeHandler(this.latLng, lastLatLng);
        	this._tempLocationChangeHandler = null;
        }
    };

    /**
     * Handler for a position error, fires the locationError event
     *
     * @param  {Error} error
     * @return {void}
     */
    HotelsMap.prototype._onPositionError = function(error) {
    	this.options.onLocationErrorHandler(error, this.latLng);

        if (this._tempLocationErrorHandler) {
        	this._tempLocationErrorHandler(error, this.latLng);
        	this._tempLocationErrorHandler = null;
        }
    };

    /**
     * Updates the user pin on the map
     *
     * @return {void}
     */
    HotelsMap.prototype._updateUserPosition = function() {
        //If its first user postion catch
        if (!this.userMarker) {
            this.centerOnUserPosition();
            this.userMarker = L.marker(this.latLng);
            this.map.addLayer(this.userMarker);
            return;
        }

        this.userMarker.setLatLng(this.latLng);
    };

	return HotelsMap;
})();

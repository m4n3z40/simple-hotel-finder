window.HotelsMap = (function() {
	var mapTilesLayerUrl = 'https://{s}.tiles.mapbox.com/v4/{mapID}/{z}/{x}/{y}.png',
        defaultOptions = {
        	mapBoxAccessToken: 'sk.eyJ1IjoibTRuM3o0MCIsImEiOiJaTTAyU1hrIn0.0sZj48IpzxjlR6CRicDI6A',
        	mapBoxMapID: 'm4n3z40.le4nfk8l',
        	defaultLatLng: [-22.9112728, -43.4484478], //Rio de janeiro
        	hotelIcon: L.icon({
	            iconUrl: 'img/hotel-marker-icon.png',
	            iconSize:     [38, 34], // size of the icon
	            iconAnchor:   [19, 17], // point of the icon which will correspond to marker's location
	            popupAnchor:  [-3, -35] // point from which the popup should open relative to the iconAnchor
	        }),
        	mapElementID: 'hotelsMap',
        	onLocationChangeHandler: emptyFn,
        	onLocationErrorHandler: emptyFn,
        	onHotelClickHandler: emptyFn
        };

    function emptyFn() {}

    function HotelsMap(options) {
		this.options = $.extend({}, defaultOptions, options);

		this.map = null;
		this.latLng = null;
		this.userMarker = null;
		this.foundHotels = null;
		this.hotelMarkers = null;
	}

	HotelsMap.prototype.initialize = function() {
		var options = this.options,
			mapTilesUrl = mapTilesLayerUrl.replace('{mapID}', options.mapBoxMapID);

        this.map = L.map(options.mapElementID, {
            center: options.defaultLatLng,
            zoom: 8
        });

        var tileLayer = L.tileLayer(mapTilesUrl + '?access_token=' + options.mapBoxAccessToken, {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, '
                       + '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; ' 
                       + '<a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18
        });

        this.map.addLayer(tileLayer);
    }

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
    }

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
    }

    HotelsMap.prototype._onPositionChange = function(position) {
    	var lastLatLng = this.latLng;

        this.latLng = [position.coords.latitude, position.coords.longitude];

        this._updateUserPosition();
        this.options.onLocationChangeHandler(this.latLng, lastLatLng);

        if (this._tempLocationChangeHandler) {
        	this._tempLocationChangeHandler(this.latLng, lastLatLng);
        	this._tempLocationChangeHandler = null;
        }
    }

    HotelsMap.prototype._onPositionError = function(error) {
    	this.options.onLocationErrorHandler(error, this.latLng);

        if (this._tempLocationErrorHandler) {
        	this._tempLocationErrorHandler(error, this.latLng);
        	this._tempLocationErrorHandler = null;
        }
    }

    HotelsMap.prototype._updateUserPosition = function() {
        //If its first user postion catch
        if (!this.userMarker) {
            this.map.setView(this.latLng, 14);
            this.userMarker = L.marker(this.latLng);
            this.map.addLayer(this.userMarker);
            return;
        }

        this.userMarker.setLatLng(this.latLng);
    }

	return HotelsMap;
})();
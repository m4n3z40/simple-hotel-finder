window.app = (function() {
    var mapBoxAccessToken = 'sk.eyJ1IjoibTRuM3o0MCIsImEiOiJaTTAyU1hrIn0.0sZj48IpzxjlR6CRicDI6A',
        mapTilesLayerUrl = 'https://{s}.tiles.mapbox.com/v4/m4n3z40.le4nfk8l/{z}/{x}/{y}.png',
        defaultLatLng = [-22.9112728, -43.4484478], //Rio de janeiro
        map = null,
        latLng = null,
        userMarker = null,
        foundHotels = null,
        hotelIcon = L.icon({
            iconUrl: 'img/hotel-marker-icon.png',
            iconSize:     [38, 34], // size of the icon
            iconAnchor:   [19, 17], // point of the icon which will correspond to marker's location
            popupAnchor:  [-3, -35] // point from which the popup should open relative to the iconAnchor
        });

    function initialize() {
        bindEvents();
    }
    
    function bindEvents() {
        document.addEventListener('deviceready', onDeviceReady, false);
    }
    
    function onDeviceReady() {
        mountMap();

        startWatchingUserLocation();
    }

    function updateUserPosition() {
        //If its first user postion catch
        if (!userMarker) {
            startRetrievingHotels();

            map.setView(latLng, 14);
            userMarker = L.marker(latLng).addTo(map);
            return;
        }

        userMarker.setLatLng(latLng);
    }

    function onPositionChange(position) {
        latLng = [position.coords.latitude, position.coords.longitude];

        updateUserPosition();
    }

    function onPositionError(error) {
        alert(error.message);
    }

    function startWatchingUserLocation() {
        navigator.geolocation.watchPosition(onPositionChange, onPositionError, {
            enableHighAccuracy: true,
            timeout: 30000 //30s
        });
    }

    function addHotelsToMap(hotels) {
        foundHotels = hotels;

        foundHotels.forEach(function(hotel) {
            L.marker([parseFloat(hotel.latitude), parseFloat(hotel.longitude)], {icon: hotelIcon}).addTo(map);
        });
    }

    function startRetrievingHotels() {
        var geocodingService = new GeocodingService();

        geocodingService
            .getAddressByLatLng(latLng)
            .then(function(response) {
                var hotelsService = new HotelsSearchService(),
                    cityName = response.results[0].locations[0].adminArea5;

                return hotelsService.getHotelsByCityName(cityName);
            }, function() {
                alert('Houve um erro a descobrir em que estado você está, tente novamente mais tarde.');
            })
            .then(function(response) {
                return response.content.hotels;
            }, function() {
                alert('Não foram encontrados nenhum hotel perto de você, tente novamente mais tarde.');
            })
            .then(addHotelsToMap);
    }
    
    function mountMap() {
        map = L.map('hotelsMap', {
            center: defaultLatLng,
            zoom: 8
        });

        L.tileLayer(mapTilesLayerUrl + '?access_token=' + mapBoxAccessToken, {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, '
                       + '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; ' 
                       + '<a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18
        }).addTo(map);
    }

    //Exposed App methods
    return {
        initialize: initialize
    };
})();
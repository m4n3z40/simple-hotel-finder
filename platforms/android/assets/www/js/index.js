window.app = (function() {
    var map = null;

    function initialize() {
        bindEvents();
    }
    
    function bindEvents() {
        document.addEventListener('deviceready', onDeviceReady, false);
    }
    
    function onDeviceReady() {
        map = new HotelsMap({
            onLocationChangeHandler: onLocationChangeHandler,
            onLocationErrorHandler: onLocationErrorHandler,
            onHotelClickHandler: onHotelClickHandler
        });

        map.initialize();
        map.startWatchingLocation();
    }

    function onLocationChangeHandler(latLng, lastLatLng) {
        //If its first user postion catch
        if (!lastLatLng) {
            startRetrievingHotels(latLng);
        }
    }

    function onLocationErrorHandler(error) {
        alert(error.message);
    }

    function startRetrievingHotels(latLng) {
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

            .then(map.addHotelsToMap.bind(map));
    }

    function onHotelClickHandler(hotel, marker, i) {
        alert(hotel.name);
    }

    //Exposed App methods
    return {
        initialize: initialize
    };
})();
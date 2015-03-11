window.app = (function() {
    var map = null,
        hotelDetailsModal = null;

    /**
     * Initializes the application
     * 
     * @return {void}
     */
    function initialize() {
        bindEvents();
    }
    
    /**
     * Binds the necessary event handlers
     * 
     * @return {void}
     */
    function bindEvents() {
        document.addEventListener('DOMContentLoaded', onDeviceReady, false);
    }
    
    /**
     * Executed when device is ready to work, thats when we start everything
     * 
     * @return {void}
     */
    function onDeviceReady() {
        map = new HotelsMap({
            onLocationChangeHandler: onLocationChangeHandler,
            onLocationErrorHandler: onLocationErrorHandler,
            onHotelClickHandler: onHotelClickHandler
        });

        hotelDetailsModal = new HotelDetailsModal();

        map.initialize();
        map.startWatchingLocation();
    }

    /**
     * The location change handler, on the first position catch it calls the hotel search service
     * 
     * @param  {Array} latLng
     * @param  {Array} lastLatLng
     * @return {void}
     */
    function onLocationChangeHandler(latLng, lastLatLng) {
        //If its first user postion catch
        if (!lastLatLng) {
            retrieveHotels(latLng);
        }
    }

    /**
     * The location error handler, just shows a alert message
     * 
     * @param  {Error} error
     * @return {void}
     */
    function onLocationErrorHandler(error) {
        alert(error.message);
    }

    /**
     * Retrieves the hotel when we know the user`s position
     * 
     * @param  {Array} latLng
     * @return {void}
     */
    function retrieveHotels(latLng) {
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

    /**
     * Tap handler the hotel markers, opens the details modal
     * 
     * @param  {Object} hotel
     * @param  {L.Marker} marker
     * @return {void}
     */
    function onHotelClickHandler(hotel, marker) {
        hotelDetailsModal.showHotel(hotel);
    }

    //Exposed App methods
    return {
        initialize: initialize
    };
})();
window.app = (function() {
    var map = null,
        hotelDetailsModal = null,
        whereAmIButton = null,
        notificationManager = null;

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
        document.addEventListener('deviceready', onDeviceReady, false);
    }

    /**
     * Executed when device is ready to work, thats when we start everything
     *
     * @return {void}
     */
    function onDeviceReady() {
        notificationManager = new NotificationManager();

        hotelDetailsModal = new HotelDetailsModal();

        map = new HotelsMap({
            onLocationChangeHandler: onLocationChangeHandler,
            onLocationErrorHandler: onLocationErrorHandler,
            onHotelClickHandler: hotelDetailsModal.showHotel.bind(hotelDetailsModal)
        });

        whereAmIButton = new WhereAmIButton({ mapInstance: map });

        map.initialize();

        notificationManager.show('Trying to get your current position...');

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
            notificationManager.show('Got your position. Retrieving hotels near you...');

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
        notificationManager.show(error.message);
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
                notificationManager.show('There was an error while trying to get your current position.');
            })

            .then(function(response) {
                return response.content.hotels;
            }, function() {
                notificationManager.show('No hotels found in your area.');
            })

            .then(map.addHotelsToMap.bind(map))

            .then(function() {
                notificationManager.hide();
            });
    }

    //Exposed App methods
    return {
        initialize: initialize
    };
})();

window.HotelsSearchService = (function() {
	var hotelsPlacesAutocompleteEndpointUrl = 'https://simple-hotel-finder.herokuapp.com/places',
		hotelsSearchEndpointUrl = 'https://simple-hotel-finder.herokuapp.com/hotels',
		defaultOptions = {};

	/**
	 * Service wrapper for the search of hotels powered by Hotel Urbano
	 *
	 * @class
	 * @param {Object} options
	 */
	function HotelsSearchService(options) {
		this.options = $.extend({}, defaultOptions, options);
	}

	/**
	 * Returns a list of places for a given name
	 * 
	 * @param  {string} name
	 * @return {$.Deferred}
	 */
	HotelsSearchService.prototype.getPlacesByName = function(name) {
		return $.ajax({
	       type: 'GET',
	        url: hotelsPlacesAutocompleteEndpointUrl,
	        data: {texto: name},
	        dataType: 'json'
	    });
	}

	/**
	 * Returns a list of hotels for a given placeID
	 * 
	 * @param  {int} placeID
	 * @return {$.Deferred}
	 */
	HotelsSearchService.prototype.getHotelsByPlaceID = function(placeID) {
		return $.ajax({
	       type: 'GET',
	        url: hotelsSearchEndpointUrl + '/' + placeID,
	        dataType: 'json'
	    });
	}

	/**
	 * Return a list of hotels for a given city name
	 * 
	 * @param  {string} cityName
	 * @return {$.Deferred}
	 */
	HotelsSearchService.prototype.getHotelsByCityName = function(cityName) {
		var me = this;

		return me.getPlacesByName(cityName)

				 .then(function(response) {
				 	return response.content[0]
				 }, function() {
				   	console.warn('Não foi possível recuperar locais no autocomplete para o texto: ' + cityName)
				 })

				 .then(function(place) {
				 	return me.getHotelsByPlaceID(place.id);
				 });
	}

	return HotelsSearchService;
})();
window.HotelsSearchService = (function() {
	var hotelsPlacesAutocompleteEndpointUrl = 'http://localhost:3000/places',
		hotelsSearchEndpointUrl = 'http://localhost:3000/hotels',
		defaultOptions = {};

	function HotelsSearchService(options) {
		this.options = $.extend({}, options, defaultOptions);
	}

	HotelsSearchService.prototype.getPlacesByName = function(name) {
		return $.ajax({
	       type: 'GET',
	        url: hotelsPlacesAutocompleteEndpointUrl,
	        data: {texto: name},
	        dataType: 'json'
	    });
	}

	HotelsSearchService.prototype.getHotelsByPlaceID = function(placeID) {
		return $.ajax({
	       type: 'GET',
	        url: hotelsSearchEndpointUrl + '/' + placeID,
	        dataType: 'json'
	    });
	}

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
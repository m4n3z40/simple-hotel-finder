window.GeocodingService = (function() {
	var defaultOptions = {
			mapQuestKey: 'Fmjtd|luu82lu7nq,7a=o5-948nh4'
		},
		reverseGeocodeApiEndpoint = 'http://open.mapquestapi.com/geocoding/v1/reverse';

	function GeocodingService(options) {
		this.options = $.extend({}, options, defaultOptions);
	}

	GeocodingService.prototype.getAddressByLatLng = function(latLng) {
		return $.ajax({
	       type: 'GET',
	        url: reverseGeocodeApiEndpoint,
	        data: { 
	        	key: this.options.mapQuestKey, 
	        	location: latLng instanceof Array ? latLng.join(',') : latLng
	        },
	        dataType: 'jsonp'
	    });
	};

	return GeocodingService;
})();
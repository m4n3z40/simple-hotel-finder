window.GeocodingService = (function() {
	var defaultOptions = {
			mapQuestKey: 'Fmjtd|luu82lu7nq,7a=o5-948nh4'
		},
		reverseGeocodeApiEndpoint = 'http://open.mapquestapi.com/geocoding/v1/reverse';

	/**
	 * Service wrapper for the mapquest geolocation API
	 * 
	 * @class
	 * @param {Object} options
	 */
	function GeocodingService(options) {
		this.options = $.extend({}, defaultOptions, options);
	}

	/**
	 * Returns the address regarding the given latLng
	 * 
	 * @param  {Array} latLng
	 * @return {$.Deferred}
	 */
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
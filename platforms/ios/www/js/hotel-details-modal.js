window.HotelDetailsModal = (function() {
	var defaultOptions = {
			elementID: 'hotelDetailsModal',
			bookHotelUrl: 'https://m.hotelurbano.com/#hoteis/{ID}'
		};

	/**
	 * Wrapper for behaviors of a modal that shows the hotel details
	 *
	 * @class
	 * @param {Object} options
	 */
	function HotelDetailsModal(options) {
		this.options = $.extend({}, defaultOptions, options);

		this.currentHotel = null;

		this.$el = $(document.getElementById(this.options.elementID));
		this.$el.hide();

		this._registerListeners();
	}

	/**
	 * Shows the details for the given hotel in the modal
	 * 
	 * @param  {Object} hotel
	 * @return {void}
	 */
	HotelDetailsModal.prototype.showHotel = function(hotel) {
		this.currentHotel = hotel;

		this.$el.find('img').attr('src', hotel.imageUrl);
		this.$el.find('figcaption').text(hotel.name);
		this.$el.find('.quality').text('' + hotel.stars + ' ' + (hotel.stars > 1 ? 'stars' : 'star'));
		this.$el.find('address').text(hotel.address);
		this.$el.find('.value').text('BRL ' + hotel.price);

		this.$el.show();
	}

	/**
	 * Register the event listeners for the modal behaviors
	 * 
	 * @return {void}
	 */
	HotelDetailsModal.prototype._registerListeners = function() {
		this.$el.find('.close-button').on('click', this.close.bind(this));
		this.$el.find('.book-hotel').on('click', this._bookHotel.bind(this));
	}

	/**
	 * Closes the modal
	 * 
	 * @param  {Event} e
	 * @return {void}
	 */
	HotelDetailsModal.prototype.close = function(e) {
		e && e.preventDefault();

		this.$el.hide();
		this.currentHotel = null;
	}

	/**
	 * Opens a window for booking a hotel
	 * 
	 * @param  {Event} e
	 * @return {void}
	 */
	HotelDetailsModal.prototype._bookHotel = function(e) {
		e && e.preventDefault();

		window.open(this.options.bookHotelUrl.replace('{ID}', this.currentHotel.hid));
	}

	return HotelDetailsModal;
})();
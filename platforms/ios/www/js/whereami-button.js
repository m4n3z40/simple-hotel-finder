window.WhereAmIButton = (function() {
    var defaultOptions = {
        selector: '.whereami-button',
        mapInstance: null
    };

    /**
     * Class that contains the behavior of the
     *
     * @class
     * @param {Object} options
     */
    function WhereAmIButton(options) {
        this.options = $.extend({}, defaultOptions, options);

        this.$el = $(this.options.selector);
        this.map = this.options.mapInstance;

        this.initialize();
    }

    /**
     * Initializes the classe's behavior
     *
     * @return {void}
     */
    WhereAmIButton.prototype.initialize = function() {
        this.$el.on('click', this.onClickHandler.bind(this));
    };

    /**
     * The handler for the click event on the button
     *
     * @param {Event} e
     * @return {void}
     */
    WhereAmIButton.prototype.onClickHandler = function(e) {
        e.preventDefault();

        this.map.centerOnUserPosition();
    };

    return WhereAmIButton;
})();

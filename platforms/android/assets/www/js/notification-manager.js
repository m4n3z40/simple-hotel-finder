window.NotificationManager = (function() {
    var defaultOptions = {
        selector: '.notification',
        text: ''
    };

    /**
     * Class that contains all the behavior of a notification
     *
     * @class
     * @param {Object} options
     */
    function NotificationManager(options) {
        this.options = $.extend({}, defaultOptions, options);

        this.$el = $(this.options.selector);
        this.text = this.options.text;

        this.initialize();
    }

    /**
     * Initializes the class behaviors
     *
     * @return {void}
     */
    NotificationManager.prototype.initialize = function() {
        this.$el.find('.close-button').on('click', this.hide.bind(this));
    };

    /**
     * Sets the text that will be shown in the notification
     *
     * @return {void}
     */
    NotificationManager.prototype.setText = function() {
        this.text = text;
    };

    /**
     * Gets the current text
     *
     * @return {string}
     */
    NotificationManager.prototype.getText = function() {
        return this.text;
    };

    /**
     * Shows the notification
     *
     * @param  {string} text
     * @return {void}
     */
    NotificationManager.prototype.show = function(text) {
        this.$el.find('.notification-content').text(text || this.text);

        this.$el.show();
    };

    /**
     * Shows hides the notification
     * 
     * @param  {Event} e
     * @return {void}
     */
    NotificationManager.prototype.hide = function(e) {
        if(e) e.preventDefault();

        this.$el.find('.notification-content').text('');

        this.$el.hide();
    };

    return NotificationManager;
})();

/* Magic Mirror
 * Module: MMM-Evil
 *
 * By cowboysdude
 *
 */
Module.register("MMM-Evil", {

    defaults: {
        updateInterval:  5 * 60 * 1000,
        animationSpeed: 1000,
        initialLoadDelay: 1870
    },

    getStyles: function() {
        return ["MMM-Evil.css"];
    }, 

    // Define start sequence.
    start: function() {
        Log.info("Starting module: " + this.name);
        this.config.lang = this.config.lang || config.language;
		this.sendSocketNotification("CONFIG", this.config);

        // Set locale.
        this.today = "";
        this.scheduleUpdate();
    },


    getDom: function() {
        var wrapper = document.createElement("div");
        wrapper.className = "description"; 
        wrapper.innerHTML = (this.evil != undefined) ? this.evil : "Loading..."; 
        return wrapper;
    },

    processEvil: function(data) {
        this.evil = data;
		this.loaded = true;
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getEvil();
        }, this.config.updateInterval);
        this.getEvil(this.config.initialLoadDelay);
    },

    getEvil: function() {
        this.sendSocketNotification('GET_EVIL');
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "EVIL_RESULT") {
            this.processEvil(payload);
        }
        this.updateDom(this.config.initialLoadDelay);
    },

});

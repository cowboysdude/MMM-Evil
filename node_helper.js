/* Magic Mirror
 * Module: MMM-Evil
 *
 * By Cowboysdude
 *
 */
const NodeHelper = require('node_helper');
const request = require('request'); 
const translate = require('@vitalets/google-translate-api');

module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting module: " + this.name);
    },


  getEvil: function() {
  var self = this;
    request({
        url: "https://evilinsult.com/generate_insult.php?lang=en&type=json",
        method: 'GET'
    }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            var apiResponse = JSON.parse(body); 
			translate(apiResponse.insult, {
                from: apiResponse.language,
                to: config.language,
                client: 'gtx'
            }).then(function(result) {
                var fact = result.text
                self.sendSocketNotification("EVIL_RESULT", fact);
            }).catch(function(err) {
                console.error("[MMM-Evil] Translation ERROR! Translation failed, will fall back to original language!");
                console.error(JSON.stringify(err));
                self.sendSocketNotification("EVIL_RESULT", apiResponse.text);
            });
        } else {
            console.error("API Error: Wrong response code: "+response.statusCode);
            console.error(JSON.stringify(response));
            console.error(JSON.stringify(error));
            self.sendSocketNotification("EVIL_RESULT", "API ERROR!");
        };
    });
},

    //Subclass socketNotificationReceived received.
    socketNotificationReceived: function(notification, payload) {
        if (notification === 'CONFIG') {
            this.config = payload;
        } else if (notification === 'GET_EVIL') {
            this.getEvil();
        }
    }
});

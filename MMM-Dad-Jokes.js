/* global Module */

/* Magic Mirror
 * Module: MMM-Dad-Jokes
 *
 * By Eric Chang
 * MIT Licensed.
 */

"use strict";

Module.register("MMM-Dad-Jokes", {

	result: {joke: "loading dad joke..."},

	defaults: {
		title: "Dad Jokes",
		updateInterval: 60*1000, // every 60 seconds
		fadeSpeed: 4*1000, // four seconds
	},

	start: function() {
		this.getJoke();
		this.scheduleUpdate();
	},

	getDom: function() {
		var wrapper = document.createElement("div");

		var joke = document.createElement("div");
		joke.className = "bright light medium";
		joke.style.textAlign = "center";
		joke.style.margin = "0 auto";
		joke.innerHTML = this.result["joke"];

		wrapper.appendChild(joke);
		return wrapper;
	},

	getJoke: function () {
		this.sendSocketNotification("GET_JOKE");
	},

	scheduleUpdate: function() {
		setInterval(() => {
			this.getJoke();
		}, this.config.updateInterval);
	},

	socketNotificationReceived: function(notification, payload) {
		if (notification == "JOKE_RESULT") {
			this.result = payload;
			this.updateDom(this.config.fadeSpeed);
		}
	},

  notificationReceived: function(notification, payload, sender) {

    if (notification === 'MODULE_DOM_CREATED') {
      // Register new joke API with MMM-Remote-Control (ignored if Remote-Control is not installed)
      let api = {
        module: this.name,
        path: "dadjokes",
        actions: {
          newJoke: {
            notification: "DADJOKE_NEWJOKE",
            prettyName: "Get New Joke"
          },
        }
      };
      this.sendNotification("REGISTER_API", api);
    }

    if (notification == "DADJOKE_NEWJOKE") {
      this.getJoke();
    }


  },
});

// MMM-OctoAgileMon.js:

/* Magic Mirror
 * Module: MMM-OctoAgileMon
 *
 * Originally by Chris Thomas
 * Modified by Alan Boyd to provide octopus Agile
 * MIT Licensed.
 */

Module.register("MMM-OctoAgileMon",{
	// Default module config.
	defaults: {
		elecApiUrl: "",
		api_key: "",
		updateInterval: 600000,		// 10 minutes
		displayTimes: 7,
		elecLow: 5,
		elecMedium: 10,
		elecHigh: 20,
		elecCostKWH: 0.1372,
		elecCostSC: 0.25,
		decimalPlaces: 2,
		showUpdateTime: true,
		retryDelay: 5000,
		animationSpeed: 2000,
	},

	start: function() {
		Log.info("Starting module: " + this.name);

		var self = this;
		var elecDataRequest=null;

		this.elecLoaded=false;

		this.getElecData(2);

		setInterval(function() {
			self.getElecData(2);
		}, this.config.updateInterval);

	},

	getElecData: function(retries) {
		Log.log("getElecData(retries=" + retries + ")");

		var self = this;

		var hash = btoa(this.config.api_key + ":");

		if(this.config.elecApiUrl!="")
		{
			var elecDataRequest = new XMLHttpRequest();
			var url = this.config.elecApiUrl + "?";
			var today = new Date();
			var tomorrow = new Date();

			tomorrow.setDate(today.getDate() + 1);

			url += "period_from=" + today.toISOString()
			url += "&period_to=" + tomorrow.toISOString()

			elecDataRequest.open("GET", url, true);
			elecDataRequest.setRequestHeader("Authorization","Basic " + hash);
			elecDataRequest.onreadystatechange = function() {
				Log.log("getElecData() readyState=" + this.readyState);
				if (this.readyState === 4) {
					Log.log("getElecData() status=" + this.status);
					if (this.status === 200) {
						self.processElecData(JSON.parse(this.response));
						retries=0;
					} else if (this.status === 401) {
						self.elecLoaded = false;
						self.updateDom(self.config.animationSpeed);
						Log.error(self.name, "getElecData() 401 error. status=" + this.status);
					} else {
						self.elecLoaded = false;
						self.updateDom(self.config.animationSpeed);
						Log.error(self.name, "getElecData() Could not load data. status=" + this.status);
					}

					if (retries>0) {
						retries=retries-1;
						self.scheduleElecRetry(retries);
					}
				}
			};
			elecDataRequest.send();
		}

	},

	scheduleElecRetry: function(retries) {
		Log.log("scheduleElecRetry() retries=" + retries);
		var self = this;
		setTimeout(function() {
			self.getElecData(retries);
		}, self.config.retryDelay);
	},

	// Override dom generator.
	getDom: function() {
		Log.log("getDom()");
		var wrapper = document.createElement("div");

		var errors = "";
		if (this.config.elecApiUrl === "" || typeof this.config.elecApiUrl === 'undefined') {
			errors = errors + "elecApiUrl not set in config.</br>";
		}

		if (this.config.api_key === "") {
			errors = errors + "API Key (api_key) not set in config.</br>";
		}

		if(errors != "") {
			wrapper.innerHTML = errors;
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		if(this.elecLoaded == false) {
			wrapper.innerHTML = "Querying Server...";
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		var table = document.createElement("table");
		table.className="small";

		var intTimes=this.config.displayTimes;

		endPoint = this.elecDataRequest.results.length - 1 - intTimes
		if (endPoint < 0)
			endPoint = 0;

		for(intLoop=this.elecDataRequest.results.length - 1; intLoop >= endPoint; intLoop--)
		{
			var thisrow = document.createElement("tr");

			var thisdatelabel = document.createElement("td");
			var start = new Date(this.elecDataRequest.results[intLoop].valid_from);
			var end = new Date(this.elecDataRequest.results[intLoop].valid_to);

			var startTime = "";
			var endTime = "";

			if (start.getMinutes() < 10) {
				startTime = start.getHours() + ":0" + start.getMinutes();
			} else {
				startTime = start.getHours() + ":" + start.getMinutes();
			}

			if (end.getMinutes() < 10) {
				endTime = end.getHours() + ":0" + end.getMinutes();
			} else {
				endTime = end.getHours() + ":" + end.getMinutes();
			}

			thisdatelabel.innerHTML = startTime + " - " + endTime;
			thisdatelabel.className = "small";

			var thiseleclabel = document.createElement("td");
			thiseleclabel.innerHTML = "---";
			thiseleclabel.className = "small";
			thiseleclabel.style.textAlign = "center";

			//we're looking for elec results for this day
			if (this.elecDataRequest) {
				if(typeof this.elecDataRequest.results[intLoop] !== 'undefined') {
					var strCol = "white";//could be green
					var intVal = this.elecDataRequest.results[intLoop].value_inc_vat;
					if(intVal<=this.config.elecLow)strCol="color:green";
					if(intVal>=this.config.elecMedium)strCol="color:orange";
					if(intVal>=this.config.elecHigh)strCol="color:red";

					strUse = intVal + " p/kWh";

					//display electricity energy usage and cost here
					thiseleclabel.innerHTML = "&nbsp;&nbsp;<span style=\"" + strCol + "\">" + strUse + "</span>";
					thiseleclabel.style.textAlign = "right";
				}
			}

			thisrow.appendChild(thisdatelabel);
			if(this.elecDataRequest) thisrow.appendChild(thiseleclabel);

			table.appendChild(thisrow);
		}

		wrapper.appendChild(table);

		return wrapper;
	},

	processElecData: function(data) {
		Log.log("processElecData()");
		var self = this;
		this.elecDataRequest = data;
		this.elecLoaded = true;
		self.updateDom(self.config.animationSpeed);
	},

});

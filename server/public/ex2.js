(function() {
	var safeCounter = 0; // added this safe counter in order to prevent a maximum-call-stack-size-exceeded exception.
	// explanation: in case the program will run for a very long time, the recursion calls will fill up the call stack.
	// will happen fast in case there are no messages to answer current time frame, so no timeout will ocuur and call stack will explode.

	var IterateMesseges = function(ads) {
		if (ads.length == 0) {
			$("#texts").empty();
			$("#pics").empty();

			$("#result").empty();
			$("#result").append('<label>No ads in current time frame</label>');
		} else {

			safeCounter++;
			if (safeCounter > 1000) {
				return; // for safety!
			}

			var currIndex = 0;

			setInterval(function () {
				replaceAds(ads[currIndex]);
				currIndex = currIndex + 1 < ads.length ? currIndex + 1 : 0;
			}, parseInt(ads[currIndex].length) * 1000); // in milisecond, wait until next call to function
		}
	};

	var replaceAds = function(ad) {
		$("#texts").empty();
		$("#pics").empty();
		$("#result").load( "./" + ad.url);

		// set texts
		for (var i = 0; i < ad.texts.length; i++) {
			$("#texts").append('<textarea>' + ad.texts[i] + '</textarea>');
		}

		// set pictures
		for (var i = 0; i < ad.pictures.length; i++) {
			$("#pics").append('<img src="' + ad.pictures[i] +'" style="height: 50px; width: 50px;">');
		}
	};

	$(document).ready(function() {
		var server = io.connect('http://localhost:8080');

		server.on('connected', function(data) {
			server.emit("getData", {screenId: window.location.pathname.split('=')[1]});
		});

		// get initial data
		server.on('screensData', function(data) {
			IterateMesseges(data);
		});

	});

}());
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

	var getCity = function(results) {
		for (i in results) {
			if ((results[i].types.indexOf("locality") != -1) ||
				(results[i].types.indexOf("administrative_area_level_3") != -1)) {
				return results[i].formatted_address
			}
		}
		return "Israel";
	};

	$(document).ready(function() {
		var server = io.connect('http://localhost:8080');

		server.on('connected', function(data) {
			GMaps.geolocate({
				success: function (position) {
					var geocoder = new google.maps.Geocoder();
					var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
					var city = "Israel";
					geocoder.geocode({'latLng': latlng}, function(results, status) {
						if (status == google.maps.GeocoderStatus.OK) {
							city = getCity(results);
							server.emit("getData", {
								screenId: window.location.pathname.split('=')[1],
								location: {lat: position.coords.latitude, lng: position.coords.longitude},
								city: city
							});
						}
					});
				}
			});
		});

		// get initial data
		server.on('screensData', function(data) {
			IterateMesseges(data);
		});

	});

}());
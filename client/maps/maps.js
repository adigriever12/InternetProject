$(document).ready(function () {
    var mapElement = document.getElementById('map');

    var mapOptions = {
        zoom: 12,
        disableDefaultUI: true,
        //mapTypeId: google.maps.MapTypeId.ROADMAP,
        // styles: [{ "featureType": "road", "elementType": "geometry", "stylers": [{ "lightness": 100 }, { "visibility": "simplified" }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "visibility": "on" }, { "color": "#C6E2FF" }] }, { "featureType": "poi", "elementType": "geometry.fill", "stylers": [{ "color": "#C5E3BF" }] }, { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "color": "#D1D1B8" }] }]
    };

    map = new google.maps.Map(mapElement, mapOptions);
    geocoder = new google.maps.Geocoder();

    $.ajax({
        url: 'http://127.0.0.1:8080/getLocations',
        dataType: "json",
        success: function (data) {
            if(data != undefined) {
                for (var i = 0; i < data.length; i++) {
                    var myLatLng = new Object();

                    myLatLng.lat = parseFloat(data[i].location.lat);
                    myLatLng.lng = parseFloat(data[i].location.lng);

                    var marker = new google.maps.Marker({
                        //  id: locations.screenId,
                        map: map,
                        position: myLatLng,
                        title: data.screenId,
                    });

                }
            }
        },
        type: 'GET'
    });


})

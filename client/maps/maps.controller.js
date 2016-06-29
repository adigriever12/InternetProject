(function() {
    'use strict';

    angular.module('maps')
        .controller('mapsController', mapsController);

    mapsController.$inject = ['mapsService', '$sce'];
    function mapsController(mapsService, $sce) {

        var vm = this;

        mapsService.getLocations().then(function(response) {
            vm.locations = response;

            drawLocationsOnMap();
        });


        function drawLocationsOnMap() {
            var mapElement = document.getElementById('map');

            var mapOptions = {
                zoom: 15,
                disableDefaultUI: true
            };

            var map = new google.maps.Map(mapElement, mapOptions);
            var geocoder = new google.maps.Geocoder();


            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    map.setCenter(initialLocation);
                    var marker = new google.maps.Marker({
                        map: map,
                        position: initialLocation,
                        title: 'מיקום נוכחי',
                        zIndex: google.maps.Marker.MAX_ZINDEX + 1
                    });



                }, function () {
                });
            }
            // Browser doesn't support Geolocation
            else {
                alert("Geolocation service failed.");
            }

            for (var i = 0; i < vm.locations.length; i++) {
                var myLatLng = {};

                myLatLng.lat = parseFloat(vm.locations[i].location.lat + 20 * i);
                myLatLng.lng = parseFloat(vm.locations[i].location.lng + 20 * i);

                var marker = new google.maps.Marker({
                    id: vm.locations[i].screenId,
                    map: map,
                    position: myLatLng,
                    title: vm.locations[i].screenId
                });

            }
        }
    }
}());
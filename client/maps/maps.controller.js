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
                zoom: 12,
                disableDefaultUI: true
            };

            var map = new google.maps.Map(mapElement, mapOptions);
            var geocoder = new google.maps.Geocoder();

            for (var i = 0; i < vm.locations.length; i++) {
                var myLatLng = {};

                myLatLng.lat = parseFloat(vm.locations[i].location.lat);
                myLatLng.lng = parseFloat(vm.locations[i].location.lng);

                var marker = new google.maps.Marker({
                    //  id: locations.screenId,
                    map: map,
                    position: myLatLng,
                    title: vm.locations[i].screenId,
                });

            }
        }
    }
}());
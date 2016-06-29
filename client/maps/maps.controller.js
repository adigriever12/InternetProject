(function() {
    'use strict';

    angular.module('maps')
        .controller('mapsController', mapsController);

    mapsController.$inject = ['mapsService', '$sce'];
    function mapsController(mapsService, $sce) {

        var vm = this;

        mapsService.getLocations().then(function(response) {
            vm.locations = response;
        });
    }
}());
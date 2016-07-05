(function() {
    'use strict';

    angular.module('maps')
        .service('mapsService', mapsService);

    mapsService.$inject = ['$http', 'SERVER'];
    function mapsService($http, SERVER) {

        function getLocations() {
            return $http.get(SERVER + 'getLocations').then(function(response) {
                return response.data;
            });
        }
        return {
            'getLocations': getLocations
        }
    }
}());
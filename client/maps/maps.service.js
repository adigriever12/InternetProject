(function() {
    'use strict';

    angular.module('maps')
        .service('mapsService', mapsService);

    mapsService.$inject = ['$http'];
    function mapsService($http) {

        function getLocations() {
            return $http.get('http://localhost:8080/getLocations').then(function(response) {
                return response.data;
            });
        }
        return {
            'getLocations': getLocations
        }
    }
}());
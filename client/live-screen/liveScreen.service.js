(function() {
    'use strict';

    angular.module('liveScreen')
        .service('liveScreenService', liveScreenService);

    liveScreenService.$inject = ['$http'];
    function liveScreenService($http) {

        function getScreens() {
            return $http.get('http://localhost:8080/screens').then(function(response) {
                return response.data;
            });
        }

        function getScreenId(params) {
            var url = 'http://localhost:8080/getScreens';

            return $http({method: "GET", url: url, params: params}).then(function(response) {

                return response.data;
            });
        }

        return {
            'getScreens': getScreens,
            'getScreenId': getScreenId
        }
    }
}());
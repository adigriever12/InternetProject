(function() {
    'use strict';

    angular.module('dashboard')
        .service('dashboardService', dashboardService);

    dashboardService.$inject = ['$http', 'SERVER'];
    function dashboardService($http, SERVER) {

        function getMessages() {
            return $http.get(SERVER + 'getAllMessages').then(function(response) {
                return response.data;
            });
        }
        function connectedScreens() {
            return $http.get(SERVER + 'getConnectedScreens').then(function(response) {
                return response.data;
            });
        }
        function getScreensCity() {
            return $http.get(SERVER + 'getScreensCity').then(function(response) {
                return response.data;
            });
        }
        return {
            'getMessages': getMessages,
            'connectedScreens': connectedScreens,
            'getScreensCity': getScreensCity
        }
    }
}());
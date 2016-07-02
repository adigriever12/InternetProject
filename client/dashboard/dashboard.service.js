(function() {
    'use strict';

    angular.module('dashboard')
        .service('dashboardService', dashboardService);

    dashboardService.$inject = ['$http'];
    function dashboardService($http) {

        function getMessages() {
            return $http.get('http://localhost:8080/getAllMessages').then(function(response) {
                return response.data;
            });
        }
        function connectedScreens() {
            return $http.get('http://localhost:8080/getConnectedScreens').then(function(response) {
                return response.data;
            });
        }
        function getScreensCity() {
            return $http.get('http://localhost:8080/getScreensCity').then(function(response) {
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
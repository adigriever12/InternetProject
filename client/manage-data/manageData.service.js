(function () {
    'use strict';

    angular.module('manageData')
        .service('manageDataService', manageDataService);

    manageDataService.$inject = ['$http'];
    function manageDataService($http) {

        function addScreen(screenId) {
            var url = 'http://localhost:8080/insertNewScreen';

            return $http({method: "GET", url: url, params: {id: screenId}}).then(function (response) {
                return response.data;
            });
        }

        function deleteScreen(screenId) {
            var url = 'http://localhost:8080/deleteScreen';

            return $http({method: "GET", url: url, params: {id: screenId}}).then(function (response) {
                return response.data;
            });
        }

        function addUrl(urlId) {
            var url = 'http://localhost:8080/insertNewUrl';

            return $http({method: "GET", url: url, params: {id: urlId}}).then(function (response) {
                return response.data;
            });
        }

        function deleteUrl(urlId) {
            var url = 'http://localhost:8080/deleteUrl';

            return $http({method: "GET", url: url, params: {id: urlId}}).then(function (response) {
                return response.data;
            });
        }

        function uploadUrlTemplate(fd) {
            return $http.post('http://localhost:8080/upload', fd, {
                headers: {'Content-Type': undefined }
            }).then(function(response) {
                return response.data;
            });
        }

        return {
            addScreen: addScreen,
            deleteScreen: deleteScreen,
            uploadUrlTemplate: uploadUrlTemplate,
            deleteUrl: deleteUrl
        }
    }
}());
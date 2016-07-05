(function () {
    'use strict';

    angular.module('manageData')
        .service('manageDataService', manageDataService);

    manageDataService.$inject = ['$http', 'SERVER'];
    function manageDataService($http, SERVER) {

        function addScreen(screenId) {
            var url = SERVER + 'insertNewScreen';

            return $http({method: "GET", url: url, params: {id: screenId}}).then(function (response) {
                return response.data;
            });
        }

        function deleteScreen(screenId) {
            var url = SERVER + 'deleteScreen';

            return $http({method: "GET", url: url, params: {id: screenId}}).then(function (response) {
                return response.data;
            });
        }

        function addUrl(urlId) {
            var url = SERVER + 'insertNewUrl';

            return $http({method: "GET", url: url, params: {id: urlId}}).then(function (response) {
                return response.data;
            });
        }

        function deleteUrl(urlId) {
            var url = SERVER + 'deleteUrl';

            return $http({method: "GET", url: url, params: {id: urlId}}).then(function (response) {
                return response.data;
            });
        }

        function uploadUrlTemplate(fd) {
            return $http.post(SERVER + 'upload', fd, {
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
(function() {
    'use strict';

    angular.module('addEdit')
        .service('addEditService', addEditService);

    addEditService.$inject = ['$http', 'SERVER'];
    function addEditService($http, SERVER) {

        function updateMessage(message) {
            var url = SERVER + 'updateMessage';

            var data = {
              message:   message
            };

            return $http({method: "POST", url: url, data: data}).then(function (response) {
                return response.data;
            });
        }

        function insertMessage(message) {
            var url = SERVER + 'insertNewMessage';

            var data = {
                message:   message
            };

            return $http({method: "POST", url: url, data: data}).then(function (response) {
                return response.data;
            });
        }

        function uploadUrlTemplate(fd) {
            return $http.post(SERVER + 'uploadPics', fd, {
                headers: {'Content-Type': undefined }
            }).then(function(response) {
                return response.data;
            });
        }

        return {
            updateMessage: updateMessage,
            insertMessage: insertMessage,
            uploadUrlTemplate: uploadUrlTemplate
        }
    }
}());
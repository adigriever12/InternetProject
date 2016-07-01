(function() {
    'use strict';

    angular.module('addEdit')
        .service('addEditService', addEditService);

    addEditService.$inject = ['$http'];
    function addEditService($http) {

        function updateMessage(message) {
            var url = 'http://localhost:8080/updateMessage';

            var data = {
              message:   message
            };

            return $http({method: "POST", url: url, data: data}).then(function (response) {
                return response.data;
            });
        }

        return {
            updateMessage: updateMessage
        }
    }
}());
(function() {
    'use strict';

    angular.module('messageFilter')
        .service('messageFilterService', messageFilterService);

    messageFilterService.$inject = ['$http'];
    function messageFilterService($http) {

        function getFilterValues(filter) {
            return $http.get('http://localhost:8080/getFilterValues=' + filter).then(function(response) {
                return response.data;
            });
        }
        function getAllMessages() {
            return $http.get('http://localhost:8080/getAllMessages').then(function(response) {
                return response.data;
            });
        }
        function getFilteredMessages(filter, value) {
            var find = {};
          
            find[filter] = value;

            var url = 'http://localhost:8080/filteredMessages';

            var data = {
                find: find
            };

            return $http({method: "POST", url: url, data: data}).then(function (response) {
                return response.data;
            });
        }
        function deleteMessage(id) {
            var url = 'http://localhost:8080/deleteMessageById';

            return $http({method: "POST", url: url, data: {id: id}}).then(function(response) {
                return response.data;
            });
        }
        return {
            'getFilterValues': getFilterValues,
            'getFilteredMessages': getFilteredMessages,
            'deleteMessage': deleteMessage,
            'getAllMessages': getAllMessages
        }
    }
}());
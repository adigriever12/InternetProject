(function() {
    'use strict';

    angular.module('messages')
        .service('messagesService', messagesService);

    messagesService.$inject = ['$http'];
    function messagesService($http) {

        function getAllMessages() {
            var url = 'http://localhost:8080/getAllMessages';

            return $http.get(url).then(function(response) {
                return response.data;
            });
        }

        function deleteMessage(id) {
            var url = 'http://localhost:8080/deleteMessageById';

            return $http({method: "POST", url: url, data: {id: id}}).then(function(response) {
                return response.data;
            });
        }

        function getMessage(id) {
            var url = 'http://localhost:8080/getMessageById';

            return $http({method: "GET", url: url, params: {id: id}}).then(function(response) {
                if (response.data.length = 1) {
                    return response.data[0];
                }
            });
        }
        
        function getAllURls() {
            var url = 'http://localhost:8080/getAllUrlTemplates';

            return $http.get(url).then(function(response) {
                return response.data;
            });
        }

        function getAllScreens() {
            return $http.get('http://localhost:8080/getAllScreensIds').then(function(response) {
                return response.data;
            });
        }

        function getScreenId(params) {
            var url = 'http://localhost:8080/getScreensIdsByConditions';

            return $http({method: "POST", url: url, data: params}).then(function(response) {

                return response.data;
            });
        }

        return {
            'getAllMessages': getAllMessages,
            'deleteMessage': deleteMessage,
            'getMessage': getMessage,
            'getAllURls': getAllURls,
            'getAllScreens': getAllScreens,
            'getScreenId': getScreenId
        }
    }
}());
(function() {
    'use strict';

    angular.module('messages')
        .service('messagesService', messagesService);

    messagesService.$inject = ['$http', 'SERVER'];
    function messagesService($http, SERVER) {

        function getAllMessages() {
            var url = SERVER + 'getAllMessages';

            return $http.get(url).then(function(response) {
                return response.data;
            });
        }

        function deleteMessage(id) {
            var url = SERVER + 'deleteMessageById';

            return $http({method: "POST", url: url, data: {id: id}}).then(function(response) {
                return response.data;
            });
        }

        function getMessage(id) {
            var url = SERVER + 'getMessageById';

            return $http({method: "GET", url: url, params: {id: id}}).then(function(response) {
                if (response.data.length = 1) {
                    return response.data[0];
                }
            });
        }
        
        function getAllURls() {
            var url = SERVER + 'getAllUrlTemplates';

            return $http.get(url).then(function(response) {
                return response.data;
            });
        }

        function getAllScreens() {
            return $http.get(SERVER + 'getAllScreensIds').then(function(response) {
                return response.data;
            });
        }

        function getScreenId(params) {
            var url = SERVER + 'getScreensIdsByConditions';

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
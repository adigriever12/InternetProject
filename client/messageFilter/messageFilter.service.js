(function() {
    'use strict';

    angular.module('messageFilter')
        .service('messageFilterService', messageFilterService);

    messageFilterService.$inject = ['$http', 'SERVER'];
    function messageFilterService($http, SERVER) {

        function getFilterValues(filter) {
            return $http.get(SERVER + 'getFilterValues=' + filter).then(function(response) {
                return response.data;
            });
        }
        function getAllMessages() {
            return $http.get(SERVER + 'getAllMessages').then(function(response) {
                return response.data;
            });
        }
        function getFilteredMessages(selectedUrlValue, selectedLengthValue, selectedPriceValue) {
            var find = {};
            
            if ((selectedUrlValue != null) && (selectedUrlValue.value != undefined) && (selectedUrlValue.value != ''))
            {
                find.url = selectedUrlValue.value;
            }
            if  ((selectedLengthValue != null) && (selectedLengthValue.value!= undefined) && (selectedLengthValue.value != ''))
            {
                find.length = selectedLengthValue.value;
            }
            if  ((selectedPriceValue != null) && (selectedPriceValue.value!= undefined) && (selectedPriceValue.value != ''))
            {
                find.price = selectedPriceValue.value;
            }
            if (find.length == 0) {
                getAllMessages();
                return;
            }
            var url = SERVER + 'filteredMessages';

            var data = {
                find: find
            };

            return $http({method: "POST", url: url, data: data}).then(function (response) {
                return response.data;
            });
        }
        function deleteMessage(id) {
            var url = SERVER + 'deleteMessageById';

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
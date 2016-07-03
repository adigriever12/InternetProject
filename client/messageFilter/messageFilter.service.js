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
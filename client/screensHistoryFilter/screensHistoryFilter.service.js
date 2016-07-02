(function() {
    'use strict';

    angular.module('screensHistoryFilter')
        .service('screensHistoryFilterService', screensHistoryFilterService);

    screensHistoryFilterService.$inject = ['$http'];
    function screensHistoryFilterService($http) {

        function getFilterValues(group) {

            var url = 'http://localhost:8080/historyFilterValuesGet';

            var data = {
                group: group
            };

            return $http({method: "POST", url: url, data: data}).then(function (response) {
                return response.data;
            });
        }
        function getFilteredData(filter, value) {
            var find = {};
            if (filter == 'city') {
                find[filter] = value;
            }
            else if(filter == 'month') {
                find.$where = 'return this.date.getMonth() == ' + (value - 1);
            }
            else {
                find.$where = 'return this.date.getFullYear() == ' + value;
            }

            var url = 'http://localhost:8080/filteredData';

            var data = {
                find: find
            };

            return $http({method: "POST", url: url, data: data}).then(function (response) {
                return response.data;
            });
        }

        return {
            'getFilterValues': getFilterValues,
            'getFilteredData': getFilteredData
        }
    }
}());
(function() {
    'use strict';

    angular.module('screensHistoryFilter')
        .service('screensHistoryFilterService', screensHistoryFilterService);

    screensHistoryFilterService.$inject = ['$http', 'SERVER'];
    function screensHistoryFilterService($http, SERVER) {

        function getFilterValues(group) {

            var url = SERVER + 'historyFilterValuesGet';

            var data = {
                group: group
            };

            return $http({method: "POST", url: url, data: data}).then(function (response) {
                return response.data;
            });
        }
        function getFilteredData(selectedCityValue, selectedMonthValue, selectedYearValue) {
            var find = {};

            if ((selectedCityValue != null) && (selectedCityValue.value != undefined) && (selectedCityValue.value != ''))
            {
                find.city = selectedCityValue.value;
            }
            if  ((selectedMonthValue != null) && (selectedMonthValue.value!= undefined) && (selectedMonthValue.value != ''))
            {
                find.$where = 'return this.date.getMonth() == ' + (selectedMonthValue.value - 1);
            }
            if  ((selectedYearValue != null) && (selectedYearValue.value!= undefined) && (selectedYearValue.value != '')) {
                if (find.$where) {
                    find.$where += ' && this.date.getFullYear() == ' + selectedYearValue.value;
                }
                else {
                    find.$where = 'return this.date.getFullYear() == ' + selectedYearValue.value;
                }
            }
            
            var url = SERVER + 'filteredData';

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
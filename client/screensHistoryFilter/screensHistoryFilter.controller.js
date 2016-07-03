(function() {
    'use strict';

    angular.module('screensHistoryFilter')
        .controller('screensHistoryFilterController', screensHistoryFilterController);

    screensHistoryFilterController.$inject = ['screensHistoryFilterService', '$sce'];
    function screensHistoryFilterController(screensHistoryFilterService, $sce) {

        var vm = this;
        vm.filters = [ "city", "year", "month" ];

        vm.data = [];

        vm.selectedCityValue = {};
        vm.selectedMonthlValue = {};
        vm.selectedYearValue = {};

        for (var i in vm.filters)
        {
            var currValue = vm.filters[i];
            //vm.selectedFilter = currValue;
            getFilterValues(currValue);
        }

        function getFilterValues(filter){
            var $group = {};
            if (filter == 'city'){
                $group._id = {city: "$city"};
            }
            else {
                $group._id = {};

                $group._id[filter] = {};
                $group._id[filter]['$' + filter] = '$date';
            }
            $group.count = {$sum: 1};
            var group = {$group: $group };

            screensHistoryFilterService.getFilterValues(group).then(function(response) {
                vm.data = [];
                vm.values = [];
                vm.selectedValue = {};
                
                for (var i in response) {

                    var val = {};

                    val.key = response[i]._id[filter] + ' (Total : ' + response[i].count + ')';
                    val.value = response[i]._id[filter];

                    vm.values.push(val);

                }
                if(filter == 'city') {
                    vm.cityValues = vm.values;
                }
                 else if(filter == 'month') {
                    vm.monthValues = vm.values;
                }
                else {
                    vm.yearValues = vm.values;
                }
            });

            vm.getFilteredData = function() {
                screensHistoryFilterService.getFilteredData(vm.selectedCityValue, vm.selectedMonthValue, vm.selectedYearValue)
                    .then(function(response) {
                        vm.data = response;
                });
            };
        };
    }
}());
(function() {
    'use strict';

    angular.module('screensHistoryFilter')
        .controller('screensHistoryFilterController', screensHistoryFilterController);

    screensHistoryFilterController.$inject = ['screensHistoryFilterService', '$sce'];
    function screensHistoryFilterController(screensHistoryFilterService, $sce) {

        var vm = this;
        vm.filters = [ "city", "year", "month" ];

        vm.selectedFilter="";
        vm.selectedValue={};
        vm.data = [];

        vm.getFilterValues = function() {
            var $group = {};
            if (vm.selectedFilter == 'city'){
                $group._id = {city: "$city"};
            }
            else {
                $group._id = {};

                $group._id[vm.selectedFilter] = {};
                $group._id[vm.selectedFilter]['$' + vm.selectedFilter] = '$date';
            }
            $group.count = {$sum: 1};
            var group = {$group: $group };

            screensHistoryFilterService.getFilterValues(group).then(function(response) {
                vm.data = [];
                vm.values = [];
                vm.selectedValue = {};
                
                for (var i in response) {

                    var val = {};

                    val.key = response[i]._id[vm.selectedFilter] + ' (' + response[i].count + ')';
                    val.value = response[i]._id[vm.selectedFilter];

                    vm.values.push(val);

                }
            });

            vm.getFilteredData = function() {
                screensHistoryFilterService.getFilteredData(vm.selectedFilter, vm.selectedValue.value).then(function(response) {
                    vm.data = response;
                });
            };
            

        };

    }
}());
(function() {
    'use strict';

    angular.module('messageFilter')
        .controller('messageFilterController', messageFilterController);

    messageFilterController.$inject = ['$location', 'messageFilterService', '$sce'];
    function messageFilterController($location, messageFilterService, $sce) {

        var vm = this;
        vm.filters = [ "url", "length", "price" ];
        vm.pricaRange = [{key: "0 - 20",
                          value: {$gte:0,
                                  $lte:20,
                                  count:0}},
                            {key: "20 - 40",
                                value: {$gte:20,
                                    $lte:40,
                                    count:0}},
                            {key: "40 - 60",
                                value: {$gte:40,
                                    $lte:60,
                                    count:0}},
                            {key: "60 - 80",
                                value: {$gte:60,
                                    $lte:80,
                                    count:0}},
                            {key: "80 - 100",
                                value: {$gte:80,
                                    $lte:100,
                                    count:0}}]
        vm.selectedFilter="";
        vm.selectedValue={};
        vm.messages = [];

        vm.getFilterValues = function() {
            messageFilterService.getFilterValues(vm.selectedFilter).then(function(response) {
                vm.messages = [];
                vm.values = [];
                vm.selectedValue = {};

                if(vm.selectedFilter == 'price') {

                    messageFilterService.getAllMessages().then(function(response) {
                        for(var i in response)
                        {
                            for(var j in vm.pricaRange)
                            {
                                if ((response[i].price <= vm.pricaRange[j].value.$lte) &&
                                    (response[i].price >= vm.pricaRange[j].value.$gte)) {
                                    vm.pricaRange[j].value.count++;
                                    break;
                                }
                            }
                        }

                        for(var i in vm.pricaRange) {
                            var val = {};

                            val.key = vm.pricaRange[i].key + ' (' + vm.pricaRange[i].value.count + ')';
                            val.value = {
                                $lte: vm.pricaRange[i].value.$lte,
                                $gte: vm.pricaRange[i].value.$gte
                            };
                            vm.values.push(val);
                        }
                    });
                }
                else {
                    for (var i in response) {

                        var val = {};

                        val.key = response[i][vm.selectedFilter] + ' (' + response[i].count + ')';
                        val.value = response[i][vm.selectedFilter];

                        vm.values.push(val);
                    }
                }
            });

            vm.getFilteredMessages = function () {
                messageFilterService.getFilteredMessages(vm.selectedFilter, vm.selectedValue.value).then(function (response) {
                    vm.messages = response;
                });
            };

            vm.delete = function(message) {
                messageFilterService.deleteMessage(message._id).then(function(response) {
                    if (response) {
                        vm.messages = vm.messages.filter(function(curr) {
                            if (curr._id != message._id) {
                                return;
                            }
                        });
                    } else {
                        alert('delete failed');
                    }
                });
            };

            vm.edit = function(message) {
                $location.url('/addEdit/' + message._id);
            };
        };
        
    }
}());
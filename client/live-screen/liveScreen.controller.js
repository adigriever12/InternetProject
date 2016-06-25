(function() {
    'use strict';

    angular.module('liveScreen')
        .controller('liveScreenController', liveScreenController);

    liveScreenController.$inject = ['liveScreenService', '$sce'];
    function liveScreenController(liveScreenService, $sce) {
        var vm = this;

        vm.from = new Date();
        vm.to = new Date();

        vm.fromTime = "09:00";
        vm.toTime = "09:00";

        vm.days = ['Sunday' ,'Monday' ,'Tuesday' ,'Wednesday' ,'Thursday', 'Friday', 'Saturday'];
        vm.selectedDays;
        // The md-select directive eats keydown events for some quick select
        // logic. Since we have a search input here, we don't need that logic.

        liveScreenService.getScreens().then(function(response) {
             vm.screens = response;
        });


        vm.result = "";
        vm.getScreen = function() {
            var params = {
                ids: vm.screens,
                fromDate: vm.from,
                toDate: vm.to,
                days: vm.selectedDays,
                fromTime: vm.fromTime,
                toTime: vm.toTime
            };

            liveScreenService.getScreenId(params).then(function(response) {
                if (response.length > 0) {
                    vm.frames = "http://localhost:8080/screen=" +response;

                    vm.result = response.length + " screens answered the search";
                } else {
                    vm.result = "no screens answered the search";
                }
            });
        };
    }
}());
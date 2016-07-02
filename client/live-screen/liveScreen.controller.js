(function() {
    'use strict';

    angular.module('liveScreen')
        .controller('liveScreenController', liveScreenController);

    liveScreenController.$inject = ['liveScreenService', '$sce'];
    function liveScreenController(liveScreenService, $sce) {
        var vm = this;

        var now = new Date();
        vm.date = now;
        vm.time = now.getHours() + ":" + now.getMinutes();

        vm.days = ['Sunday' ,'Monday' ,'Tuesday' ,'Wednesday' ,'Thursday', 'Friday', 'Saturday'];
        vm.selectedDays;
        // The md-select directive eats keydown events for some quick select
        // logic. Since we have a search input here, we don't need that logic.

        liveScreenService.getScreens().then(function(response) {
             vm.screens = response;
        });


        vm.result = "";
        vm.getScreen = function() {
            if (!vm.selectedDays) {
                alert('you have to pick at least one day');
                return;
            }

            var params = {
                ids: vm.screens,
                date: vm.date,
                days: vm.selectedDays,
                time: vm.time
            };

            liveScreenService.getScreenId(params).then(function(response) {
                if (response.length > 0) {
                    vm.frames = response.map(function(curr) {
                        return {url: $sce.trustAsResourceUrl("http://localhost:8080/screen=" + curr),
                                id: curr};
                    });

                    vm.result = response.length + " screens answered the search";
                } else {
                    vm.result = "no screens answered the search";
                }
            });
        };
    }
}());
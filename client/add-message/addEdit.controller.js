(function() {
    'use strict';

    angular.module('addEdit')
        .controller('addEditController', addEditController);

    addEditController.$inject = ['$routeParams', 'messagesService'];
    function addEditController($routeParams, messagesService) {
        var vm = this;

        vm.message = {};

        var messageId = $routeParams.message;
        if (messageId) {
            messagesService.getMessage(messageId).then(function(response) {
                vm.message.name = response.name;
                vm.message.texts = response.texts;
                vm.message.pictures = response.pictures;
                vm.message.url = response.url;
                vm.message.length = response.length;
                vm.message.frames = response.frames;
                vm.message.timeFrame = [];//response.timeFrame;

                response.timeFrame.forEach(function(curr) {
                    vm.message.timeFrame.push({fromTime: curr.fromTime,
                        toTime: curr.toTime, days: curr.days, fromDate: new Date(curr.fromDate),
                        toDate: new Date(curr.toDate)});
                });
            });
        }

        vm.save = function() {
            
        };
    }
}());
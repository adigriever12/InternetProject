(function () {
    'use strict';

    angular.module('messages')
        .controller('messagesController', messagesController);

    messagesController.$inject = ['$scope', '$location', 'messagesService'];
    function messagesController($scope, $location, messagesService) {
        var vm = this;

        messagesService.getAllMessages().then(function (response) {
            vm.messages = response;
        });

        messagesService.getAllScreens().then(function (response) {
            vm.screens = response;
        });

        vm.screenFilter = function(message) {
            if (!vm.selectedScreen) {
                return true;
            }
            return message.frames.indexOf(vm.selectedScreen) > -1;

        };

        vm.delete = function (message) {
            messagesService.deleteMessage(message._id).then(function (response) {
                if (response) {
                    vm.messages = vm.messages.filter(function (curr) {
                        if (curr._id != message._id) {
                            return true;
                        }

                        return false;
                    });
                } else {
                    alert('delete failed');
                }
            });
        };

        vm.edit = function (message) {
            $location.url('/addEdit/' + message._id);
        };
    }
}());
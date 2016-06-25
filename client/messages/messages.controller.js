(function() {
    'use strict';

    angular.module('messages')
        .controller('messagesController', messagesController);

    messagesController.$inject = ['$location', 'messagesService'];
    function messagesController($location, messagesService) {
        var vm = this;

        messagesService.getAllMessages().then(function(response) {
            vm.messages = response;
        });

        vm.delete = function(message) {
            messagesService.deleteMessage(message._id).then(function(response) {
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
    }
}());
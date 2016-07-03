(function () {
    'use strict';

    angular.module('messageOperations', [])
        .directive('messageOperationsView', messageOperationsView);

    messageOperationsView.$inejct = ['$location', 'messagesService'];
    function messageOperationsView($location, messagesService) {

        function link(scope, element, attrs, controller) {
            element.children().bind('click', function() {
                if (attrs.class == "edit") {
                    $location.url('/addEdit/' + scope.id);
                } else if (attrs.class == "delete") {
                    messagesService.deleteMessage(scope.id).then(function(response) {
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
                }
            });
        }

        return {
            templateUrl: 'messages/message-operations/message.html',
            scope: {
                id: '@'
            },
            link: link
        };
    }
}());
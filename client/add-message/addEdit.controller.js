(function () {
    'use strict';

    angular.module('addEdit')
        .controller('addEditController', addEditController);

    addEditController.$inject = ['$scope', '$routeParams', 'messagesService', 'addEditService'];
    function addEditController($scope, $routeParams, messagesService, addEditService) {
        var vm = this;

        vm.message = {};

        var messageId = $routeParams.message;
        if (messageId) {
            messagesService.getMessage(messageId).then(function (response) {
                vm.message.name = response.name;
                vm.message.texts = response.texts.map(function (curr, index) {
                    return {id: index, value: curr};
                });
                vm.message.pictures = response.pictures.map(function (curr, index) {
                    return {id: index, value: curr};
                });
                //vm.message.url = response.url;//vm.selectedUrl
                vm.selectedUrl = response.url;
                vm.message.length = response.length;
                vm.message.price = response.price;
                vm.message.frames = response.frames;
                vm.message.timeFrame = [];//response.timeFrame;

                response.timeFrame.forEach(function (curr) {
                    var timeFrom = curr.fromTime.split(':');
                    var timeTo = curr.toTime.split(':');
                    vm.message.timeFrame.push({
                        fromTime: new Date(1970, 0, 1, timeFrom[0], timeFrom[1], 0),
                        toTime: new Date(1970, 0, 1, timeTo[0], timeTo[1], 0),
                        days: curr.days,
                        fromDate: new Date(curr.fromDate),
                        toDate: new Date(curr.toDate)
                    });
                });
            });
        } else {
            vm.message.texts = [{id: 0, value: ""}];
            vm.message.pictures = [];

            var date = new Date();
            date.setUTCHours(0, 0, 0, 0);

            vm.message.timeFrame = [{fromDate: date, toDate: date,
                fromTime: new Date(1970, 0, 1, 0, 0, 0),
                toTime: new Date(1970, 0, 1, 0, 0, 0), days: []}];
        }

        messagesService.getAllURls().then(function (response) {
            vm.allURLs = response;
        });

        messagesService.getAllScreens().then(function (response) {
            vm.allScreens = response;
        });

        vm.delete = function (message, array) {
            var index = array.indexOf(message);
            array.splice(index, 1);
        };

        vm.allDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        vm.add = function (array) {

            if (array.length > 0) {
                array.push({id: array[array.length - 1].id + 1, value: ""});
            } else {
                array.push({id: 0, value: ""});
            }
        };

        vm.addTimeFrame = function() {
          vm.message.timeFrame.push({fromDate: new Date(), toDate: new Date(),
              fromTime: new Date(1970, 0, 1, 0, 0, 0),
              toTime: new Date(1970, 0, 1, 0, 0, 0), days: []});
        };

        vm.clearSearchTerm = function () {
            vm.searchTerm = "";
        };

        vm.currentFile = [];

        vm.deletePicture = function(picture) {
            var index = vm.message.pictures.indexOf(picture);
            vm.message.pictures.splice(index, 1);
        };

        vm.fileChanged = function(picture, files) {
            if (files.length > 0) {
                $scope.$apply(function () {
                    if (files[0].type.indexOf("image") == -1) {
                        vm.imageError = "error"
                    } else {
                        vm.imageError = undefined;
                        vm.currentFile.push({id: picture.id, value: files[0]});
                    }
                });
            }
        };

        vm.fileInput = function(picture) {

        };

        vm.save = function () {
            var requestMessage = {};
            angular.copy(vm.message, requestMessage);

            vm.message.timeFrame.forEach(function (curr, index) {
                var fromTime = vm.message.timeFrame[index].fromTime;
                requestMessage.timeFrame[index].fromTime = ("0" + fromTime.getHours()).slice(-2) + ":" + ("0" + fromTime.getMinutes()).slice(-2);

                var toTime = vm.message.timeFrame[index].toTime;
                requestMessage.timeFrame[index].toTime = ("0" + toTime.getHours()).slice(-2) + ":" + ("0" + toTime.getMinutes()).slice(-2);

                //requestMessage.timeFrame[index].fromDate.setHours(0, 0, 0, 0);// = requestMessage.timeFrame[index].fromDate.toISOString();
                //requestMessage.timeFrame[index].toDate.setHours(0, 0, 0, 0);// = requestMessage.timeFrame[index].toDate.toISOString();
                var fromDate = requestMessage.timeFrame[index].fromDate;
                requestMessage.timeFrame[index].fromDate = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate(), 0, 0, 0).toUTCString();
                var toDate = requestMessage.timeFrame[index].toDate;
                requestMessage.timeFrame[index].toDate = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate(), 0, 0, 0).toUTCString();
            });

            requestMessage.pictures = requestMessage.pictures.map(function (curr) {
                return curr.value
            });

            requestMessage.texts = requestMessage.texts.map(function (curr) {
                return curr.value
            });

            // update
            if (messageId) {
                requestMessage.id = messageId;
                addEditService.updateMessage(requestMessage).then(function(result) {
                    if (result) {
                        alert('updated successfully');
                    } else {
                        alert('update failed');
                    }
                });
            } else { // new message
                addEditService.insertMessage(requestMessage).then(function(result) {
                    if (result) {
                        alert('insert message successfully');
                    } else {
                        alert('insertion failed');
                    }
                });
            }
        };
    }
}());
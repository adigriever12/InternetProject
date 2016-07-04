(function () {
    'use strict';

    angular.module('manageData')
        .controller('manageDataController', manageDataController);

    manageDataController.$inject = ['messagesService', 'manageDataService', '$scope'];
    function manageDataController(messagesService, manageDataService, $scope) {
        var vm = this;

        messagesService.getAllScreens().then(function (results) {
            vm.screens = results;
        });

        messagesService.getAllURls().then(function (results) {
            vm.urls = results;
        });

        $scope.uploadFile = function () {
            var fd = new FormData();
            //Take the first selected file
            fd.append("file", vm.currentFile[0]);

            manageDataService.uploadUrlTemplate(fd).then(function (response) {
                vm.response = 'success';
                if (!response) {
                    vm.response = 'failed';
                }
            });
        };

        $scope.fileChanged = function (files) {
            vm.response = undefined;
            if (files.length > 0) {
                $scope.$apply(function () {
                    if (files[0].type != "text/html") {
                        vm.currentFile = "notHtml";
                    } else {
                        vm.currentFile = files;
                    }
                });
            }
        };

        vm.addUrl = function () {
            if (vm.newUrl) {
                if (vm.urls.indexOf(vm.newUrl) > -1) {
                    alert("template already exists");
                } else {
                    manageDataService.addUrl(vm.newUrl).then(function (result) {
                        if (result) {
                            vm.urls.push(vm.newUrl);
                            alert('insertion succeeded');
                        } else {
                            alert('insertion failed');
                        }
                    });
                }
            }
        };

        vm.deleteUrl = function (urlId) {
            manageDataService.deleteUrl(urlId).then(function (result) {
                if (result) {
                    var index = vm.urls.indexOf(urlId);
                    vm.urls.splice(index, 1);
                    alert('deletion succeeded');
                } else {
                    alert('deletion failed');
                }
            });
        };

        vm.addScreen = function () {
            if (vm.newScreen) {
                if (vm.screens.indexOf(vm.newScreen) > -1) {
                    alert("screen id already exists");
                } else {
                    manageDataService.addScreen(vm.newScreen).then(function (result) {
                        if (result) {
                            vm.screens.push(vm.newScreen);
                            alert('insertion succeeded');
                        } else {
                            alert('insertion failed');
                        }
                    });
                }
            }
        };

        vm.deleteScreen = function (screenId) {
            manageDataService.deleteScreen(screenId).then(function (result) {
                if (result) {
                    var index = vm.screens.indexOf(screenId);
                    vm.screens.splice(index, 1);
                    alert('deletion succeeded');
                } else {
                    alert('deletion failed');
                }
            });
        };
    }
}());
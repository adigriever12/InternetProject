(function() {
    'use strict';

    angular.module('app', ['ngRoute', 'ngMaterial','jkuri.timepicker','angularMoment', 'fileInput',
                            'admin', 'liveScreen', 'messages', 'addEdit', 'maps', 'dashboard', 'manageData',
                            'messageFilter', 'screensHistoryFilter'])
        .constant("SERVER", "http://localhost:8080/");
}());
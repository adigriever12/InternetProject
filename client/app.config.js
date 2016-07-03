(function() {
    'use strict';

    angular.module('app')
        .config(appConfig);

    appConfig.$inject = ['$routeProvider', '$mdDateLocaleProvider'];
    function appConfig($routeProvider, $mdDateLocaleProvider) {
        $routeProvider
            .when('/displayScreens', {
                templateUrl: 'live-screen/liveScreen.html',
                controller: 'liveScreenController',
                controllerAs: 'vm'
            })
            .when('/messages', {
               templateUrl: 'messages/messages.html',
                controller: 'messagesController',
                controllerAs: 'vm'
            })
            .when('/addEdit/:message', {
                templateUrl: 'add-message/addEdit.html',
                controller: 'addEditController',
                controllerAs: 'vm'
            })
            .when('/addEdit', {
                templateUrl: 'add-message/addEdit.html',
                controller: 'addEditController',
                controllerAs: 'vm'
            })
            .when('/manageData', {
                templateUrl: 'manage-data/manageData.html',
                controller: 'manageDataController',
                controllerAs: 'vm'
            })
            .when('/maps', {
                templateUrl: 'maps/maps.html',
                controller: 'mapsController',
                controllerAs: 'vm'
            })
            .when('/dashboard', {
                templateUrl: 'dashboard/dashboard.html',
                controller: 'dashboardController',
                controllerAs: 'vm'
            })
            .when('/about', {
                templateUrl: 'about/about.html'
            })
            .when('/messageFilter', {
                templateUrl: 'messageFilter/messageFilter.html',
                controller: 'messageFilterController',
                controllerAs: 'vm'
            })
            .when('/screensHistoryFilter', {
                templateUrl: 'screensHistoryFilter/screensHistoryFilter.html',
                controller: 'screensHistoryFilterController',
                controllerAs: 'vm'
            });

            //.otherwise({redirectTo: '/'});

        $mdDateLocaleProvider.formatDate = function(date) {
            return moment(date).format('DD-MM-YYYY');
        };
    }
}());
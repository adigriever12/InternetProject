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
            });
            //.otherwise({redirectTo: '/'});

        $mdDateLocaleProvider.formatDate = function(date) {
            return moment(date).format('DD-MM-YYYY');
        };
    }
}());
(function() {
    'use strict';

    angular.module('admin')
        .controller('adminController', adminController);

    adminController.$inject = ['$scope', '$route'];
    function adminController($scope, $route) {
        
        var vm = this;

        vm.menu = [
            {name: 'Dashboard', link: 'dashboard', img: 'glyphicon glyphicon-stats'},
            {name: 'View Message', link: 'messages', img: 'glyphicon glyphicon-eye-open'},
            {name: 'New Messages', link: 'addEdit', img: 'glyphicon glyphicon-plus'},
            {name: 'Manage Data', link: 'manageData', img: 'glyphicon glyphicon-pencil'},
            {name: 'Display Live Screen', link: 'displayScreens', img: 'glyphicon glyphicon-blackboard'},
            {name: 'Maps',link: 'maps', img: 'glyphicon glyphicon-map-marker'},
            {name: 'About',link: 'about', img: 'glyphicon glyphicon-user'}
        ];

        if ($route.current) {
            vm.current = $route.current.$$route.originalPath.substr(1);
        }

        vm.setChosen = function(item) {
            vm.current = item.link;
        };
    }
}());
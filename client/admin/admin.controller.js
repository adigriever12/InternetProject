(function() {
    'use strict';

    angular.module('admin')
        .controller('adminController', adminController);

    adminController.$inject = [];
    function adminController() {
        
        var vm = this;

        vm.menu = [
            {name: 'Dashboard', link: '', img: 'glyphicon glyphicon-stats'},
            {name: 'View Messages', link: '', img: 'glyphicon glyphicon-eye-open'},
            {name: 'Manage Data', link: '', img: 'glyphicon glyphicon-pencil'},
            {name: 'Display Live Screen', link: 'displayScreens', img: 'glyphicon glyphicon-blackboard'},
            {name: 'Maps',link: '', img: 'glyphicon glyphicon-map-marker'}
        ];

        // TODO make like selected
        vm.setChosen = function() {
            $(this).attr('class', 'selected');
        };
    }
}());
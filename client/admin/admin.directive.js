(function() {
    'use strict';

    angular.module('admin')
        .directive('adminView', adminView);

    adminView.$inject = [];
    function adminView() {
        return {
            templateUrl: 'admin/admin.html',
            scope: {},
            controller: 'adminController',
            controllerAs: 'vm',
            replace: true
        }
    }
}());
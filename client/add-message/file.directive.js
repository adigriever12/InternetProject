(function() {
    angular.module('fileInput', [])
        .directive('fileInputView', fileInputView)
        .controller('fileInputController', fileInputController);

    fileInputView.$inject = [];
    function fileInputView() {
        return {
            scope: {
                fileread: "="
            },
            link: function (scope, element, attributes) {
                element.bind("change", function (changeEvent) {
                    scope.$apply(function () {
                        //scope.fileread(changeEvent.target.files[0]);
                        // or all selected files:
                        scope.$parent.picture.value = changeEvent.target.files[0];
                    });
                });
            }
            //controller: 'fileInputController',
            //controllerAs: 'vm'
        }
    }


    fileInputController.$inject = [];
    function fileInputController() {
        var vm = this;


    }
}());
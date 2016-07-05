(function () {
    angular.module('fileInput', [])
        .directive('fileInputView', fileInputView)

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
                        if (changeEvent.target.files.length > 0 && changeEvent.target.files[0].type.indexOf("image") != -1) {
                            scope.$parent.picture.file = changeEvent.target.files[0];
                        } else {
                            scope.$parent.picture.value = "error";
                        }
                    });
                });
            }
        }
    }
}());
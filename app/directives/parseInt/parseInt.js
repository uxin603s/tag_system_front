angular.module('app').directive('parseInt', [function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attrs, controller) {
            controller.$formatters.push(function (modelValue) {
                // console.log('model', modelValue, typeof modelValue);
                return '' + modelValue;
            });

            controller.$parsers.push(function (viewValue) {
                // console.log('view', viewValue, typeof viewValue);
                return parseInt(viewValue,10);
            });
        }
    }
} ])
angular.module('app').directive('ngEnter', function () {
    return {
		link:function ($scope, element, attrs) {
			element.bind("keydown keypress", function (e) {
				if(e.which === 13) {
					$scope.$apply(function (){
						$scope.$eval(attrs.ngEnter);
					});
					e.preventDefault();
				}
			});
		}
	}
});
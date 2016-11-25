angular.module("app").run(['$rootScope',function($rootScope) {
	$rootScope.__proto__.confirm=window.confirm(message);			
	$rootScope.__proto__.alert=window.alert(message);
	$rootScope.__proto__.Math=window.Math;
	$rootScope.__proto__.isNaN=window.isNaN;
}]);
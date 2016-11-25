angular.module("app",[]).config(['$compileProvider',function($compileProvider){
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
}])
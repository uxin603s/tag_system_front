angular.module('app').component("idRelation",{
bindings:{
	list:"=",
	sourceId:"=",
	func:"=",
},
templateUrl:'app/components/idRelation/idRelation.html?t='+Date.now(),
controller:["$scope","crud","tagName",
function($scope,crud,tagName){
	$scope.add=$scope.$ctrl.func.add.bind($scope.$ctrl.func,$scope.$ctrl.sourceId);
	$scope.del=$scope.$ctrl.func.del.bind($scope.$ctrl.func,$scope.$ctrl.sourceId);
	// $scope.$watch("$ctrl.list",$scope.$ctrl.func.sort.bind($scope.$ctrl.func,$scope.$ctrl.sourceId),1)
}],
})
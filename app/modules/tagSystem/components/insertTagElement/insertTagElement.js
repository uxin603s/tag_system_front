angular.module('tagSystem').component("insertTagElement",{
bindings:{
	id:"=",
	list:"=",
},
templateUrl:'app/modules/tagSystem/components/insertTagElement/insertTagElement.html?t='+Date.now(),
controller:["$scope","tagSystem",function($scope,tagSystem){
	$scope.tagName=tagSystem.data.tagName;
	$scope.delTag=tagSystem.delTag;
	$scope.addTag=tagSystem.addTag;
}],
});
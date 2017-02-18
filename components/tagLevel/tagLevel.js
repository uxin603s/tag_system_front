angular.module('tagSystem').component("tagLevel",{
bindings:{
	tid:"=",
},
templateUrl:'app/modules/tagSystem/components/tagLevel/tagLevel.html?t='+Date.now(),
controller:["$scope","tagSystem",function($scope,tagSystem){
	var getTagLevel=function(){
		// tagSystem.data.tagRelation[$scope.$ctrl.tid]=[];
		var where_list=[{field:'tid',type:0,value:$scope.$ctrl.tid}]
		var post_data={
			func_name:"TagLevel::getList",
			arg:{
				where_list:where_list,
			}
		}
		tagSystem.post(post_data,function(res){
			if(res.status){
				res.list.sort(function(a,b){
					return a.sort_id-b.sort_id;
				})
				$scope.lids=res.list.map(function(val){
					tagSystem.data.levelTagRelation[val.id]={};
					return val.id
				})
				
				$scope.selects=[0];
				$scope.selects.length=$scope.lids.length;
			}
		});
	
	}
	$scope.$ctrl.$onInit=function(){
		getTagLevel()
	}
}],
})
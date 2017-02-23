angular.module('tagSystem').component("tagRelation",{
bindings:{
	selects:"=",
	index:"=",
	lids:"=",
	show:"=",
	getTag:"=",
},
templateUrl:'app/modules/tagSystem/components/tagRelation/tagRelation.html?t='+Date.now(),
controller:["$scope","tagSystem","tagRelation",function($scope,tagSystem,tagRelation){
	$scope.tagName=tagSystem.data.tagName;

	// $scope.getTag=function(tid){
		// tagSystem.data.selects.push(tid);
	// }
	
	$scope.delTag=function(index){
		if(!confirm("確認刪除?")){
			return
		}
		
		var id=$scope.id;
		var child_id=$scope.list.splice(index,1).pop();
		var level_id=$scope.lid;
		
		if($scope.check_delete && $scope.check_delete[child_id] && $scope.check_delete[child_id].length){
			alert("下層有資料無法刪除")
			$scope.list.splice(index,0,child_id);//還原
			return
		}
		var post_data={
			func_name:"TagRelation::delete",
			arg:{
				child_id:child_id,
				id:id,
				level_id:level_id,
			}
		}
		tagSystem.post(post_data,function(res){
			console.log(res)
			if(!res.status){
				
			}
		})
	}
	$scope.addTag=function(tag_name){
		if(!tag_name){
			alert("請勿空白")
			return
		}
		var tag_name=tag_name;
		var id=$scope.id;
		var sort_id=$scope.list?$scope.list.length:0;
		var level_id=$scope.lid;
		var post_data={
			func_name:"TagRelation::insert",
			arg:{
				id:id,
				sort_id:sort_id,
				level_id:level_id,
				tag_name:tag_name,
			}
		}
		tagSystem.post(post_data,function(res){
			if(res.status){
				
				$scope.list.push(res.insert.child_id);
				tagSystem.data.tagName[res.insert.child_id]=tag_name;
			}else{
				alert("資料重複")
			}
		})
	}
	
	
	$scope.$ctrl.$onInit=function(){
		$scope.tagSystem=tagSystem.data;
		$scope.$watch("$ctrl.selects["+$scope.$ctrl.index+"]",function(id){
			if(!isNaN(id)){
				$scope.show=true;
				$scope.id=id;
				$scope.lid=$scope.$ctrl.lids[$scope.$ctrl.index];
				$scope.list=tagRelation.data.TagLevelRelation[$scope.lid][id];
				$scope.check_delete=tagRelation.data.TagLevelRelation[$scope.$ctrl.lids[$scope.$ctrl.index+1]];
			}else{
				$scope.show=false;
			}
			
		},1)
		
	}
}],
});
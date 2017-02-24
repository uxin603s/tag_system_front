angular.module('tagSystem').component("tagLevel",{
bindings:{
	tid:"=",
	show:"=",
	getTag:"=",
},
templateUrl:'app/modules/tagSystem/components/tagLevel/tagLevel.html?t='+Date.now(),
controller:["$scope","tagSystem","tagLevel","tagType","tagRelation",function($scope,tagSystem,tagLevel,tagType,tagRelation){
	$scope.add=function(){
		if(!confirm("確認新增階層?")){
			return
		}
		var post_data={
			func_name:"TagLevel::insert",
			arg:{
				sort_id:$scope.list.length,
				tid:$scope.$ctrl.tid,
			},
		}
		tagSystem.post(post_data,function(res){
			if(res.status){
				$scope.list.push(res.insert.id);
				tagLevel.data.TagLevelRelation[res.insert.id]={};
				if($scope.list.length==1){
					$scope.selects[0]=0
				}
				// console.log($scope.TagLevelRelation[res.insert.id]);
			}
		})
	}
	$scope.del=function(index){
		if(!confirm("確認刪除階層?")){
			return
		}
		
		var id=$scope.list.splice(index,1).pop();
		var tid=$scope.$ctrl.tid;
		
		// var ggwp=tagLevel.data.TagLevelRelation[id].reduce(function(a,b){
			// return a+b.length
		// },0)
		var check_have=0;
		for(var i in tagLevel.data.TagLevelRelation[id]){
			check_have+=tagLevel.data.TagLevelRelation[id][i].length
		}
		
		if(check_have){
			alert("該階層有標籤無法刪除!!!")
			$scope.list.splice(index,0,id)
			return
		}
		
		var post_data={
			func_name:"TagLevel::delete",
			arg:{
				id:id,
				tid:$scope.$ctrl.tid,
			},
		}
		tagSystem.post(post_data,function(res){
			console.log(res)
			if(res.status){
				delete tagLevel.data.TagLevelRelation[res.where.id];
			}else{
				$scope.list.splice(index,0,id)
			}
		})
		// console.log(lid,tid);
	}
	
	$scope.$ctrl.$onInit=function(){
		$scope.tagSystem=tagSystem.data
		$scope.tagLevel=tagLevel.data
		$scope.tagRelation=tagLevel.data
		
		
		$scope.$watch("tagLevel.selects["+$scope.$ctrl.tid+"]",function(selects){
			$scope.selects=selects;
		},1)
		$scope.$watch("tagLevel.tagTypeLevel["+$scope.$ctrl.tid+"]",function(tagTypeLevel){
			$scope.list=tagTypeLevel;
		},1)
		$scope.primary_data=tagType.data.primary_data
		
	}
}],
});
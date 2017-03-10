angular.module('tagSystem').component("tagRelation",{
bindings:{
	selects:"=",
	index:"=",
	lids:"=",
	show:"=",
	getTag:"=",
},
templateUrl:'app/modules/tagSystem/components/tagRelation/tagRelation.html?t='+Date.now(),
controller:["$scope","tagSystem","tagLevel",function($scope,tagSystem,tagLevel){
	$scope.tagName=tagSystem.data.tagName;
	
	$scope.delTag=function(index){
		if(!confirm("確認刪除?")){
			return
		}
		
		var id=$scope.id;
		var child_id=$scope.list.splice(index,1).pop();
		var level_id=$scope.lid;
		var check_delete=tagLevel.data.TagLevelRelation[$scope.$ctrl.lids[$scope.$ctrl.index+1]];
		if(check_delete && check_delete[child_id] && check_delete[child_id].length){
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
			console.log(res)
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
		var watch;
		$scope.$watch("$ctrl.selects["+$scope.$ctrl.index+"]",function(id){
			watch && watch();
			if(!isNaN(id)){
				$scope.id=id;
				$scope.lid=$scope.$ctrl.lids[$scope.$ctrl.index];
				tagLevel.getTagRelation($scope.lid,id,function(list){
					$scope.list=list;
					$scope.show=true;
					if(list[0]){
						$scope.$ctrl.selects[$scope.$ctrl.index+1]=list[0];
					}
					watch=$scope.$watch("list",sort_update.bind(this,$scope.lid,id),1);
				})
				
			}else{
				if($scope.$ctrl.index==0){
					$scope.$ctrl.selects[$scope.$ctrl.index]=0;
				}
				$scope.list=[]
				$scope.show=false;
			}
			// console.log($scope.list)
		},1)		
	}
	var sort_update=function(level_id,id,nv,ov){
		
		if(nv.length==ov.length){
			for(var i in nv){
				if(nv[i]!=ov[i]){
					var post_data={
						func_name:"TagRelation::update",
						arg:{
							update:{
								sort_id:i
							},
							where:{
								level_id:level_id,
								id:id,
								child_id:nv[i],
							},
						}
					}
					tagSystem.post(post_data,function(res){
						console.log(res)
					})
				}
			}
		}
	}
	
}],
});
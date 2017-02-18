angular.module('tagSystem').component("tagRelation",{
bindings:{
	selects:"=",
	index:"=",
	lids:"=",
},
templateUrl:'app/modules/tagSystem/components/tagRelation/tagRelation.html?t='+Date.now(),
controller:["$scope","tagSystem",function($scope,tagSystem){
	$scope.tagName=tagSystem.data.tagName;
	
	$scope.getTag=function(tid){
		tagSystem.data.selects.push(tid);
	}
	var addTagRelation=function(arg,callback){
		var post_data={
			func_name:"TagRelation::insert",
			arg:arg
		}
		tagSystem.post(post_data,callback)
	}
	$scope.delTag=function(index,list){
		
		var child_id=list.splice(index,1).pop();
		var id=$scope.$ctrl.selects[$scope.$ctrl.index];
		var level_id=$scope.$ctrl.lids[$scope.$ctrl.index];
		
		var next_lid=$scope.$ctrl.lids[$scope.$ctrl.index+1];
		if(next_lid){
			var next_list=tagSystem.data.levelTagRelation[next_lid];
			if(next_list){
				if(next_list[child_id].length){
					// console.log(next_list[child_id])
					alert("下層有資料無法刪除")
					list.splice(index,0,child_id)
					return
				}
			}
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
		var post_data={
			func_name:"TagName::insert",
			arg:{
				name:tag_name
			}
		}
		tagSystem.post(post_data,function(res){
			tagSystem.data.tagName[res.insert.id]=res.insert.name;
			var child_id=res.insert.id;
			var id=$scope.$ctrl.selects[$scope.$ctrl.index];
			var sort_id=$scope.list[id]?$scope.list[id].length:0;
			var level_id=$scope.$ctrl.lids[$scope.$ctrl.index];
			
			addTagRelation({
				id:id,
				sort_id:sort_id,
				level_id:level_id,
				child_id:child_id,
			},function(res){
				if(res.status){
					$scope.list[id]||($scope.list[id]=[])
					$scope.list[id].push(child_id);
				}else{
					alert("資料重複")
				}
			})
			
			
		})
	}
	var getTagRelation=function(){
		return new Promise(function(resolve,reject){
			var lid=$scope.$ctrl.lids[$scope.$ctrl.index];
			var where_list=[]
			where_list.push({field:'level_id',type:0,value:lid})
			var post_data={
				func_name:"TagRelation::getList",
				arg:{
					where_list:where_list,
					order_list:[
						{field:'sort_id',type:0},
					]
				}
			}
			tagSystem.post(post_data,function(res){
				if(res.status){
					var tids=[];
					for(var i in res.list){
						var data=res.list[i];
						var id=data.id;
						var child_id=data.child_id;
						if(!$scope.list[id]){
							$scope.list[id]=[];
						}
						
						
						$scope.list[id].push(child_id)
						tids.push(child_id)
					}
					for(var i in $scope.list){
						$scope.watch_once("list["+i+"]",$scope.sort_update)
					}
					
					tagSystem.getTagName(tids);
					
					if($scope.$ctrl.selects.length>$scope.$ctrl.index+1)
					if(!$scope.$ctrl.selects[$scope.$ctrl.index+1]){
						var select=$scope.$ctrl.selects[$scope.$ctrl.index];
						$scope.$ctrl.selects[$scope.$ctrl.index+1]=$scope.list[select][0];
					}
				}
				
			});
		})
	}
	$scope.watch_once=function(name,callback){
		
		$scope.watch || ($scope.watch={});		
		if($scope.watch[name]){
			return;
		}
		$scope.watch[name] && $scope.watch[name]();
		$scope.watch[name]=$scope.$watch(name,callback,1)
	}
	
	$scope.sort_update=function(nv,ov){
		if(nv.length==ov.length){
			for(var i in nv){
				if(nv[i]!=ov[i]){
					var id=$scope.$ctrl.selects[$scope.$ctrl.index];
					var sort_id=$scope.list[id]?$scope.list[id].length:0;
					var level_id=$scope.$ctrl.lids[$scope.$ctrl.index];
					var child_id=nv[i];
					var post_data={
						func_name:"TagRelation::update",
						arg:{
							update:{
								sort_id:i
							},
							where:{
								level_id:level_id,
								id:id,
								child_id:child_id,
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
	
	$scope.$ctrl.$onInit=function(){
		$scope.list=tagSystem.data.levelTagRelation[$scope.$ctrl.lids[$scope.$ctrl.index]];
		getTagRelation()
	}
}],
})
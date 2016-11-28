angular.module("app").component("tagRecusion",{
bindings:{
	levelList:"=",
	levelIndex:"=",//第幾層
	selectList:"=",
	select:"=",//這層選
},
templateUrl:'app/components/tagRecusion/tagRecusion.html?t='+Date.now(),
controller:["$scope","tagName","cache","crud",
function($scope,tagName,cache,crud){
	
	$scope.cache=cache;
	$scope.level_id=$scope.$ctrl.levelList[$scope.$ctrl.levelIndex].id;	
	
	$scope.search={tagName:''};
	$scope.get=function(){
		clearTimeout($scope.timer);
		$scope.timer=setTimeout(function(){
			promiseRecursive(function* (){
				var level_id=$scope.level_id;
				var id=$scope.$ctrl.select?$scope.$ctrl.select:0;
				$scope.watch_list && $scope.watch_list();
				if(!cache.relation[level_id][id]){
					var where_list=[
						{field:'level_id',type:0,value:level_id},
						{field:'id',type:0,value:id},
					];
					var res=yield crud.get("TagRelation",{where_list:where_list})
					
					if(res.status){
						yield tagName.idToName(res.list.map(function(val){
							return val.child_id;
						}));
						res.list.sort(function(a,b){
							return a.sort_id-b.sort_id;
						})
						
						cache.relation[level_id][id]=res.list;
					}else{
						cache.relation[level_id][id]=[];
					}
				}
				
				var index=cache.relation[level_id][id].findIndex(function(val){
					return val.child_id==$scope.$ctrl.selectList[$scope.$ctrl.levelIndex].select;
				});
				
				if(index==-1){
					delete $scope.$ctrl.selectList[$scope.$ctrl.levelIndex].select;
				}
				
				if($scope.$ctrl.levelList.length-1!=$scope.$ctrl.levelIndex){
					if(!$scope.$ctrl.selectList[$scope.$ctrl.levelIndex+1].select){
						var id=cache.relation[level_id][id][0].child_id;
						var level_id=$scope.$ctrl.levelList[$scope.$ctrl.levelIndex+1].id;
						var where_list=[
							{field:'level_id',type:0,value:level_id},
							{field:'id',type:0,value:id},
						];
						var res=yield crud.get("TagRelation",{where_list:where_list})
						if(res.status){
							$scope.$ctrl.selectList[$scope.$ctrl.levelIndex].select=id;
						}
					}
				}
				$scope.watch_list=$scope.$watch("cache.relation["+level_id+"]["+id+"]",crud.sort.bind(this,"TagRelation","child_id"),1)
				$scope.$apply();
			}())
		},0)
	}
	
	$scope.add=function(search){
		promiseRecursive(function* (){
			var res=yield tagName.nameToId(search.tagName);
			var child_id=res[0].id;
			var id=$scope.$ctrl.select?$scope.$ctrl.select:0;
			var level_id=$scope.$ctrl.levelList[$scope.$ctrl.levelIndex].id;
			
			var sort_id=$scope.list.length;
			
			var add={
				level_id:level_id,
				id:id,
				child_id:child_id,
				sort_id:sort_id,
			}
			var index=cache.relation[level_id][id].findIndex(function(val){
				return val.child_id==child_id
			})
			if(index==-1){
				cache.relation[level_id][id].push(add);
				crud.add("tagRelation",add);
			}
			
			search.tagName='';
			$scope.$apply();
		}())
	}
	$scope.del=function(index){
		var id=$scope.$ctrl.select?$scope.$ctrl.select:0;
		var level_id=$scope.$ctrl.levelList[$scope.$ctrl.levelIndex].id;
		var del=angular.copy(cache.relation[level_id][id].splice(index,1).pop());
		crud.del("TagRelation",del)
	}
	
	$scope.$watch("$ctrl.select",$scope.get,1)
	$scope.$watch("cache.relation",$scope.get,1)
	$scope.$watch("$ctrl.selectList["+$scope.$ctrl.levelIndex+"].select",function(select){
		if(!select){
			if($scope.$ctrl.selectList[$scope.$ctrl.levelIndex+1]){
				delete $scope.$ctrl.selectList[$scope.$ctrl.levelIndex+1].select
			}
		}
	},1)
	
}]
});
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
				var select=$scope.$ctrl.select?$scope.$ctrl.select:0;
				if(!cache.relation[level_id] || !cache.relation[level_id][select]){
					var where_list=[
						{field:'level_id',type:0,value:level_id},
						{field:'id',type:0,value:select},
					];
					// console.log(level_id,select)
					var res=yield crud.get("TagRelation",{where_list:where_list})
					
					if(res.status){
						for(var i in res.list){
							var data=res.list[i];
							var id=data.id;
							var child_id=data.child_id;
							var level_id=data.level_id;
							cache.relation[level_id] || (cache.relation[level_id]={});
							cache.relation[level_id][id] || (cache.relation[level_id][id]={})
							cache.relation[level_id][id][child_id]=data;
						}
						yield tagName.idToName(res.list.map(function(val){
							return val.child_id;
						}));
						$scope.$apply();
					}
				}
				$scope.watch_list && $scope.watch_list();
				$scope.list=[];
				
				if(cache.relation[$scope.level_id]){
					var relation=cache.relation[$scope.level_id][$scope.$ctrl.select?$scope.$ctrl.select:0];
					if(relation){
						var select=$scope.$ctrl.selectList[$scope.$ctrl.levelIndex].select
						if(!relation[select]){
							delete $scope.$ctrl.selectList[$scope.$ctrl.levelIndex].select
						}
						for(var i in relation){
							$scope.list.push(relation[i])
						}
					}
				}
				$scope.list.sort(function(a,b){
					return a.sort_id-b.sort_id;
				})
				$scope.$apply();
				
				
				if($scope.list.length){					
					if($scope.$ctrl.levelList.length-1!=$scope.$ctrl.levelIndex)
					if(!$scope.$ctrl.selectList[$scope.$ctrl.levelIndex+1].select){
						var select=$scope.list[0].child_id;
						var level_id=$scope.$ctrl.levelList[$scope.$ctrl.levelIndex+1].id;
						var where_list=[
							{field:'level_id',type:0,value:level_id},
							{field:'id',type:0,value:select},
						];
						var res=yield crud.get("TagRelation",{where_list:where_list})
						if(res.status){
							$scope.$ctrl.selectList[$scope.$ctrl.levelIndex].select=select;
							$scope.$apply();
						}
					}
				}
				$scope.watch_list=$scope.$watch("list",crud.sort.bind(this,"TagRelation","child_id"),1)
				$scope.$apply();
			}())
		},0)
	}
	
	$scope.add=function(search){
		promiseRecursive(function* (){
			var res=yield tagName.nameToId(search.tagName);
			var child_id=res[0].id;
			var select=$scope.$ctrl.select?$scope.$ctrl.select:0;
			var level_id=$scope.$ctrl.levelList[$scope.$ctrl.levelIndex].id;
			
			cache.relation[$scope.level_id] || (cache.relation[$scope.level_id]={});
			cache.relation[$scope.level_id][select] || (cache.relation[$scope.level_id][select]={});
			var sort_id=Object.keys(cache.relation[$scope.level_id][select]).length;
			
			var add={
				level_id:level_id,
				id:select,
				child_id:child_id,
				sort_id:sort_id,
			}
			cache.relation[$scope.level_id][select][child_id]=add;
			crud.add("tagRelation",add);
			search.tagName='';
		}())
	}
	$scope.del=function(index){
		var del=angular.copy($scope.list.splice(index,1).pop());
		var level_id=del.level_id;
		var id=del.id;
		var child_id=del.child_id;
		delete cache.relation[level_id][id][child_id];
		crud.del("TagRelation",del)
	}
	
	
	$scope.$watch("$ctrl.select",function(select){
		if(!select){
			select=0;
		}
		$scope.get()
	
	},1)
	$scope.$watch("$ctrl.selectList["+$scope.$ctrl.levelIndex+"].select",function(select){
		if(!select){
			if($scope.$ctrl.selectList[$scope.$ctrl.levelIndex+1]){
				delete $scope.$ctrl.selectList[$scope.$ctrl.levelIndex+1].select
			}
		}
	},1)
	$scope.$watch("cache.relation["+$scope.level_id+"]",$scope.get,1)
}
]
});
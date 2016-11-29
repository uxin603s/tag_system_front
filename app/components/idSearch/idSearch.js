angular.module('app').component("idSearch",{
bindings:{},
templateUrl:'app/components/idSearch/idSearch.html?t='+Date.now(),
controller:["$scope","cache","crud","tagName",
function($scope,cache,crud,tagName){
	$scope.cache=cache;
	cache.idSearch || (cache.idSearch=[]);
	$scope.search=cache.idSearch;
	$scope.result={};
	$scope.$watch("cache.selectList",function(value){
		if(!value)return;
		var selectList=cache.selectList;
		var insert;
		for(var tid in selectList){
			if(cache.tagType.selects.indexOf(tid*1)==-1)continue;
			var data=selectList[tid][selectList[tid].length-1]
			if(data.select){
				var select=data.select
				for(var i in $scope.search){
					var source_id=$scope.search[i];
					if($scope.result[source_id]){
						var index=$scope.result[source_id].findIndex(function(val){
							return val.tid==select;
						});
						
						if(index==-1){
							var arg={
								tid:select,
								source_id:source_id,
								wid:cache.webList.select,
								sort_id:$scope.result[source_id].length,
							}
							$scope.result[source_id].push(arg);
							
							crud.add('WebRelation',arg)
							cache.tagCount[select] || (cache.tagCount[select]=0);
							cache.tagCount[select]++;
						}
					}
				}
				insert=cache.tagName[select];
				delete data.select;
				// break;
			}
		}
	},1);
	var watch_search=function(){
		if(!$scope.search)return;
		if(!$scope.search.length)return;
		$scope.result={};
		clearTimeout($scope.search_timer)
		$scope.search_timer=setTimeout(function(){
			promiseRecursive(function* (){
				var wid=cache.webList.select;
				var where_list=[
					{field:'wid',type:0,value:wid},
				];
				for(var i in $scope.search){
					var id=$scope.search[i];
					where_list.push({field:'source_id',type:0,value:id})
					$scope.result[id]=[];
				}
				var res=yield crud.get("WebRelation",{where_list:where_list})
				if(res.status){
					res.list.sort(function(a,b){
						return a.sort_id-b.sort_id;
					})
					for(var i in res.list){
						var data=res.list[i];
						var source_id=data.source_id;
						$scope.result[source_id] || ($scope.result[source_id]=[])
						$scope.result[source_id].push(data)
					}
					var ids=res.list.map(function(val){return val.tid})
					yield tagName.idToName(ids,1);
					
					$scope.$apply();
					
				}
			}())
		},0)
	}
	$scope.$watch("cache.webList.select",watch_search,1);
	$scope.$watch("search",watch_search,1);
	
	$scope.add=function(id){
		if($scope.search.indexOf(id)==-1){
			$scope.search.push(id)
		}
	}
	$scope.del=function(index){
		var source_id=$scope.search.splice(index,1).pop();
	}
}],
})
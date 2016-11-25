angular.module('app').component("idRelation",{
	bindings:{
		list:"=",
		sourceId:"=",
	},
	templateUrl:'app/components/idRelation/idRelation.html?t='+Date.now(),
	controller:["$scope","idRelation","cache",function($scope,idRelation,cache){
		$scope.cache=cache;
		$scope.idRelation=idRelation
		$scope.$watch("$ctrl.list",idRelation.ch,1);	
		return;
		var prevClickSearch;
		var watch_select=function(){
			clearTimeout($scope.clickSearch_timer)
			$scope.clickSearch_timer=setTimeout(function(){
				if(cache.id_search.select.indexOf($scope.$ctrl.sourceId)==-1)return;
				
				var currClickSearch=cache.clickSearch.filter(function(val){
					return !val.type;
				}).map(function(val){
					return val.name;
				});
				
				var list=cache.id_search.result[$scope.$ctrl.sourceId];
				for(var i in currClickSearch){
					promiseRecursive(function* (name){
						var index=list.findIndex(function(val){
							return $scope.cache.tagName[val.id]==name;
						})
						if(index==-1)
							yield $scope.add_relation(name);
						
					}(currClickSearch[i]))
				}
				for(var i in prevClickSearch){
					var name=prevClickSearch[i]
					if(currClickSearch.indexOf(name)==-1){
						var index=list.findIndex(function(val){
							return $scope.cache.tagName[val.id]==name;
						})
						if(index!=-1)
							$scope.del_relation(index);
					}
				}
				prevClickSearch=currClickSearch;
				$scope.$apply();
			},0)
		}

		$scope.$watch("cache.id_search.select",watch_select,1)
		$scope.$watch("cache.clickSearch",watch_select,1)

	}],
})

/*
return;

*/
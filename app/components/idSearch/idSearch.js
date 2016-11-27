angular.module('app').component("idSearch",{
	bindings:{},
	templateUrl:'app/components/idSearch/idSearch.html?t='+Date.now(),
	controller:["$scope","cache","idRelation",function($scope,cache,idRelation){
		$scope.cache=cache
		
		// console.log(cache.webList.select)
		return
		cache.idSearch || (cache.idSearch={});
		cache.idSearch.search || (cache.idSearch.search=[])
		idRelation.search=cache.idSearch.search;
		$scope.idRelation=idRelation;
		$scope.$watch("idRelation.search",function(value){
			if(!value)return;
			if(!value.length)return;
			
			idRelation.get(value,wid);
		},1)
	
		$scope.add=function(id){
			if(idRelation.search.indexOf(id)==-1){
				idRelation.search.push(id)
			}
		}
		$scope.del=function(index){
			var source_id=idRelation.search.splice(index,1).pop();
			delete idRelation.result[source_id];
		}
		
	}],
})
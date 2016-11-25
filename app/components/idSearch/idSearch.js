angular.module('app').component("idSearch",{
	bindings:{},
	templateUrl:'app/components/idSearch/idSearch.html?t='+Date.now(),
	controller:["$scope","cache","idRelation",function($scope,cache,idRelation){
		cache.idSearch || (cache.idSearch={});
		cache.idSearch.search || (cache.idSearch.search=[])
		idRelation.search=cache.idSearch.search;
		$scope.idRelation=idRelation;
		$scope.$watch("idRelation.search",function(value){
			if(!value)return;
			if(!value.length)return;
			var wid=cache.webList.list[cache.webList.select].id
			idRelation.get(value,wid);
		},1)
	
		$scope.add_id_search=function(id){
			if(idRelation.search.indexOf(id)==-1){
				idRelation.search.push(id)
			}
		}
		$scope.del_id_search=function(index){
			var source_id=idRelation.search.splice(index,1).pop();
			delete idRelation.result[source_id];
		}
		
	}],
})
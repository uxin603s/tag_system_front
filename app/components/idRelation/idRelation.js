angular.module('app').component("idRelation",{
bindings:{
	list:"=",
	sourceId:"=",
},
templateUrl:'app/components/idRelation/idRelation.html?t='+Date.now(),
controller:["$scope","cache","crud","tagName",
function($scope,cache,crud,tagName){
	$scope.cache=cache;
	$scope.$watch("$ctrl.list",crud.sort.bind(this,'WebRelation','tid'),1)
	$scope.add=function(tag){
		if(!tag.name)return;
		tagName.nameToId(tag.name,1)
		.then(function(list){
			var tid=list[0].id;
			var index=$scope.$ctrl.list.findIndex(function(val){
				return val.tid==tid
			})
			if(index==-1){
				var arg={
					tid:tid,
					source_id:$scope.$ctrl.sourceId,
					wid:cache.webList.select,
					sort_id:$scope.$ctrl.list.length,
				}
				
				$scope.$ctrl.list.push(arg);
				crud.add('WebRelation',arg)
				// console.log(cache.tagCount[tid])
				cache.tagCount[tid] || (cache.tagCount[tid]=0);
				cache.tagCount[tid]++;
			}
			tag.name='';
			$scope.$apply();
		})
	};
	$scope.del=function(index){
		var del=angular.copy($scope.$ctrl.list.splice(index,1).pop());
		crud.del('WebRelation',del)
		cache.tagCount[del.tid]--;
		// .then(function(res){
			// console.log(res)
		// })
		
	}
	
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

}],
})
angular.module('app').component("tagLevel",{
bindings:{
	editMode:"=",
	tid:"=",
},
templateUrl:'app/components/tagLevel/tagLevel.html?t='+Date.now(),
controller:
["$scope","crud",function($scope,crud){
	$scope.cache.levelList[$scope.$ctrl.tid] || ($scope.cache.levelList[$scope.$ctrl.tid]=[])
	$scope.cache.selectList[$scope.$ctrl.tid] || ($scope.cache.selectList[$scope.$ctrl.tid]=[])
	var sort=function(a,b){
		return a.sort_id-b.sort_id;
	}
	$scope.get=function(){
		var where_list=[
			{field:'tid',type:0,value:$scope.$ctrl.tid},
		]
		crud.get("TagLevel",{where_list:where_list})
		.then(function(res){
			if(res.status){
				res.list.sort(sort);
				$scope.list=res.list;
				$scope.cache.levelList[$scope.$ctrl.tid]=res.list;
				
				for(var i in res.list){
					$scope.cache.relation[res.list[i].id] || ($scope.cache.relation[res.list[i].id]={});
				}
				var cut=$scope.list.length-$scope.cache.selectList[$scope.$ctrl.tid].length;
				for(var i=0;i<cut;i++){
					$scope.cache.selectList[$scope.$ctrl.tid].push({});
				}
				if(cut<0){
					$scope.cache.selectList[$scope.$ctrl.tid].splice($scope.list.length,Math.abs(cut))
				}
				
			}else{
				$scope.list=[];
			}
			$scope.$apply();
		})
		
	}
	$scope.get();
	
	$scope.add=function(){
		var arg={
			tid:$scope.$ctrl.tid,
			sort_id:$scope.list.length,
		};
		crud.add("TagLevel",arg)
		.then(function(res){
			$scope.list.push(res.insert);
			$scope.cache.relation[res.insert.id] || ($scope.cache.relation[res.insert.id]={});
			$scope.cache.selectList[$scope.$ctrl.tid].push({});
			$scope.$apply();
		})
	}
	
	$scope.del=function(index){
		if($scope.list.length-1!=index)return;
		var list=$scope.list.splice(index,1).pop();
		var arg=angular.copy(list);
		var select=$scope.cache.selectList[$scope.$ctrl.tid].splice(index,1).pop();
		
		crud.del("TagLevel",arg)
		.then(function(res){
			if(res.status){
				delete $scope.cache.relation[arg.id];
			}else{
				$scope.list.push(list)
				$scope.cache.selectList[$scope.$ctrl.tid].push(select)
			}
			$scope.$apply();
		});
		
	}
	
}]
});
angular.module('app').component("tagLevel",{
	bindings:{
		editMode:"=",
		tid:"=",
	},
	templateUrl:'app/components/tagLevel/tagLevel.html?t='+Date.now(),
	controller:
	["$scope","cache","crud",
	function($scope,cache,crud){
		$scope.cache=cache;
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
					cache.selectList[$scope.$ctrl.tid] || (cache.selectList[$scope.$ctrl.tid]=[])
					var cut=$scope.list.length-cache.selectList[$scope.$ctrl.tid].length;
					for(var i=0;i<cut;i++){
						cache.selectList[$scope.$ctrl.tid].push({});
					}
					if(cut<0){
						cache.selectList[$scope.$ctrl.tid].splice($scope.list.length,Math.abs(cut))
					}
					// console.log(cut);
					// cache.selectList[$scope.$ctrl.tid]
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
			$scope.list.push(arg);
			cache.selectList[$scope.$ctrl.tid].push({});
			crud.add("TagLevel",arg);
		}
		
		$scope.del=function(index){
			if($scope.list.length-1!=index)return;
			var arg=angular.copy($scope.list.splice(index,1).pop());
			cache.selectList[$scope.$ctrl.tid].splice(index,1);
			crud.del("TagLevel",arg)
			.then(function(res){
				console.log(res)
			});
			
		}
		
	}]
});
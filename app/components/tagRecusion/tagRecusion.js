angular.module("app").component("tagRecusion",{
	bindings:{
		// editMode:"=",
		
		// relation:"=",//relation快取
		// levelList:"=",//階層資料
		// tagName:"=",//標籤名稱
		// tagCount:"=",//標籤名稱
		
		levelIndex:"=",//第幾層
		select:"=",//這層選
		selectList:"=",
		
		childIds:"=",
		lockLv1:"=",//第一層鎖定
		mode:"=",//標籤是否用按鈕顯示
		
		clickSearch:"=",//選擇的標籤
	},
	templateUrl:'app/components/tagRecusion/tagRecusion.html?t='+Date.now(),
	controller:["$scope","tagRelation","tagName","cache",
	function($scope,tagRelation,tagName,cache){
		$scope.cache=cache;
		$scope.level_id=cache.levelList[$scope.$ctrl.levelIndex].id;		
		$scope.search={tagName:''};
		
		
		$scope.add=function(search){
			promiseRecursive(function* (){
				var res=yield tagName.nameToId(search.tagName);
				var select=$scope.$ctrl.select?$scope.$ctrl.select:0;
				var sort_id=0;
				if(cache.relation[$scope.level_id]){
					if(cache.relation[$scope.level_id][select])
						sort_id=Object.keys(cache.relation[$scope.level_id][select]).length;
				}
				var add={
					level_id:$scope.level_id,
					id:select,
					child_id:res[0].id,
					sort_id:sort_id,
				}
				tagRelation.add(add);
				search.tagName='';
			}())
		}
		$scope.del=function(index){
			var del=angular.copy($scope.list[index]);
			tagRelation.del(del)
			.then(function(res){
				if(res.status){
					$scope.list.splice(index,1)
					$scope.$apply();
				}
			})
		}
		var watch_list=function(value){
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
			
			if($scope.list.length){					
				if(cache.levelList.length-1!=$scope.$ctrl.levelIndex)
				if(!$scope.$ctrl.selectList[$scope.$ctrl.levelIndex].select){
					var child_id=$scope.list[0].child_id;
					
					tagRelation.get_list(child_id,$scope.$ctrl.levelIndex+1)
					.then(function(res){
						if(res.status){
							$scope.$ctrl.selectList[$scope.$ctrl.levelIndex].select=child_id;
							$scope.$apply();
						}
					})						
				}
			}
			$scope.watch_list=$scope.$watch("list",function(curr,prev){
				if(!curr)return;
				if(!prev)return;
				if(curr.length!=prev.length)return;
				
				for(var i in curr){
					if(curr[i].child_id!=prev[i].child_id){
						var where=angular.copy(curr[i]);
						delete where.sort_id
						var update={sort_id:i};
						var ch={
							update:update,
							where:where
						}
						curr[i].sort_id=i;
						
						tagRelation.ch(ch)
						.then(function(res){
							console.log(res)
						})
					}
				}
			},1)
		}
		
		$scope.$watch("$ctrl.select",function(value){
			tagRelation.get_list(value,$scope.$ctrl.levelIndex);
			watch_list(value);
		},1)
		$scope.$watch("$ctrl.selectList["+$scope.$ctrl.levelIndex+"].select",function(select){
			if(!select){
				if($scope.$ctrl.selectList[$scope.$ctrl.levelIndex+1]){
					delete $scope.$ctrl.selectList[$scope.$ctrl.levelIndex+1].select
				}
			}
		},1)
		$scope.$watch("cache.relation["+$scope.level_id+"]",watch_list,1)
			
			
		
	}]
});
angular.module('app').component("tagSearch",{
	bindings:{},
	templateUrl:'app/components/tagSearch/tagSearch.html?t='+Date.now(),
	controller:["$scope","cache","tagName","webRelation",
	function($scope,cache,tagName,webRelation){
		$scope.cache=cache;
		cache.absoluteSearch || (cache.absoluteSearch=[]);
		var watch_clickSearch=function(){
			clearTimeout($scope.selectListTimer);
			$scope.selectListTimer=setTimeout(function(){
				cache.clickSearch=[];
				var selectList=cache.selectList
				for(var tid in selectList){
					if(cache.tagType.selects.indexOf(tid*1)==-1)continue;
					var select=selectList[tid][selectList[tid].length-1].select;
					if(select){
						var name=cache.tagName[select]
						cache.clickSearch.push({id:select,name:name})
					}else{
						var data=selectList[tid][selectList[tid].length-2];
						if(data){
							var select=data.select;
							if(select){
								var level_id=cache.levelList[tid][cache.levelList[tid].length-1].id
								if(cache.relation[level_id]){
									var list=cache.relation[level_id][select];
									for(var i in list){
										var id=list[i].child_id;
										var name=cache.tagName[id]
										cache.clickSearch.push({id:id,name:name,type:1})
									}
								}
							}
						}
					}
				}
				$scope.$apply();
			},0)
		}
		$scope.$watch("cache.tagType.selects",watch_clickSearch,1)
		$scope.$watch("cache.webList.select",watch_clickSearch,1)
		$scope.$watch("cache.selectList",watch_clickSearch,1)
		$scope.$watch("cache.relation",watch_clickSearch,1)
		
		var interSearch=function(){
			clearTimeout($scope.interSearchTimer);
			$scope.interSearchTimer=setTimeout(function(){
				// console.log('interSearch')
				promiseRecursive(function* (){
					cache.diffSearch=[];
					var search=angular.copy(cache.absoluteSearch);
					var clickSearch=angular.copy(cache.clickSearch);
					for(var i in clickSearch){
						var index=search.findIndex(function(val){
							return val.name==clickSearch[i].name	
						})
						if(index==-1){
							cache.diffSearch.push(clickSearch[i]);
							search.push(clickSearch[i]);
						}
					}
					if(search.length){
						
						var value=search.map(function(val){
							return val.name;
						})
						var list=yield tagName.nameToId(value,1);
						if(search.length==list.length){
							var require_id=[];
							var option_id=[];
							for(var i in list){
								var data=list[i];
								var id=data.id;
								var name=data.name;
								var find=search.find(function(val){
									return val.name==name;
								});
								if(find.type){
									option_id.push(id);
								}else{
									require_id.push(id)
								}
							}
							var wid=cache.webList.select
							var res=yield webRelation.getInter(require_id,option_id,wid);
							if(res.status){
								$scope.result=res.list.map(function(val){
									return val.source_id;
								});
								$scope.$apply();
							}else{
								yield Promise.reject("webRelation沒資料");
							}
						}else{
							yield Promise.reject("搜尋不存在的標籤");
						}
					}else{
						yield Promise.reject("沒有搜尋");
					}
					$scope.$apply();
				}())
				.catch(function(message){
					$scope.result=[];
					$scope.$apply();
				})
			},0)
		}
		$scope.$watch("cache.absoluteSearch",interSearch,1)
		$scope.$watch("cache.clickSearch",interSearch,1)
		
		$scope.add=function(name){
			var index=cache.absoluteSearch.findIndex(function(val){
				return val.name==name;
			})
			if(index==-1){
				cache.absoluteSearch.push({name:name});
			}
		}
		$scope.del=function(index){
			cache.absoluteSearch.splice(index,1);
		}
	}],
})
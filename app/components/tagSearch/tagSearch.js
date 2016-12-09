angular.module('app').component("tagSearch",{
	bindings:{},
	templateUrl:'app/components/tagSearch/tagSearch.html?t='+Date.now(),
	controller:["$scope","cache","tagName","webRelation",
	function($scope,cache,tagName,webRelation){
		$scope.cache=cache;
		$scope.result=[];
		cache.absoluteSearch || (cache.absoluteSearch=[]);
		var interSearch=function(){
			clearTimeout($scope.interSearchTimer);
			$scope.interSearchTimer=setTimeout(function(){
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
		$scope.$watch("cache.mode",interSearch,1)
		$scope.$watch("cache.clickSearch",interSearch,1)
		$scope.$watch("cache.absoluteSearch",interSearch,1);
		//getCount
		$scope.$watch("cache.absoluteSearch",function(value){
			clearTimeout($scope.getCountTimer);
			$scope.getCountTimer=setTimeout(function(){
				promiseRecursive(function* (){
					var wid=cache.webList.select
					var tid_arr;
					if(value.length){
						var names=value.map(function(val){return val.name;})
						var list=yield tagName.nameToId(names,1)
						
						if(list.length){
							tid_arr=list.map(function(val){
								return val.id;
							})
						}
					}
					webRelation.getCount(wid,tid_arr);
					$scope.$apply();
				}());
			},0)
		},1)
		
		
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
		
		postMessageHelper.receive('tagSystem',function(res){
			if(res.name=="tagSearchId"){
				cache.absoluteSearch=[];
				for(var i in res.value){
					cache.absoluteSearch.push({name:res.value[i]});
				}
			}
			$scope.$apply();
		})
		$scope.$watch("result",function(result){
			postMessageHelper
				.send("tagSystem",{name:'tagSearchId',value:result})
		},1)
		
	}],
})
angular.module('app').component("tagSearch",{
	bindings:{},
	templateUrl:'app/components/tagSearch/tagSearch.html?t='+Date.now(),
	controller:["$scope","cache","tagName","webRelation",
	function($scope,cache,tagName,webRelation){
		$scope.cache=cache;
		cache.tag_search || (cache.tag_search={});
		cache.tag_search.search || (cache.tag_search.search=[]);
		cache.tag_search.absoluteSearch || (cache.tag_search.absoluteSearch=[]);
		cache.clickSearch || (cache.clickSearch=[]);
		cache.tag_search.diffSearch || (cache.tag_search.diffSearch=[]);
		
		var interSearch=function(){
			clearTimeout($scope.interSearchTimer);
			$scope.interSearchTimer=setTimeout(function(){
				var absoluteSearch=angular.copy(cache.tag_search.absoluteSearch);
				var name_arr=angular.copy(cache.tag_search.absoluteSearch)
				.map(function(val){
					return val.name;
				})
				// console.log(name_arr)
				tagName
				.nameToId(name_arr,1)
				.then(function(res){
					cache.require_id=res.map(function(val){
						return val.id;
					})
					
					// cache.option_id=option_id;
					webRelation.getCount();
				})
				
				
				var clickSearch=angular.copy(cache.clickSearch);
				cache.tag_search.diffSearch=[];
				for(var i in clickSearch){
					var index=absoluteSearch.findIndex(function(val){
						return val.name==clickSearch[i].name;
					})
					if(index==-1){
						cache.tag_search.diffSearch.push(clickSearch[i]);
						absoluteSearch.push(clickSearch[i]);
					}
					// else{
						// absoluteSearch[index].type=1;
					// }
				}
				
				cache.tag_search.search=absoluteSearch;
				$scope.$apply();
				tag_search_id();
			},0)
			
		}
		
		$scope.$watch("cache.tag_search.absoluteSearch",interSearch,1)
		$scope.$watch("cache.clickSearch",interSearch,1)
		
		var tag_search_id=function(){
			clearTimeout($scope.tag_search_id_timer)
			$scope.tag_search_id_timer=setTimeout(function(){
				promiseRecursive(function* (){
					var value=cache.tag_search.search.map(function(val){
						return val.name;
					});
					
					if(!value.length){
						yield Promise.reject("沒有搜尋資料");
					}
					var list=yield tagName.nameToId(value,1);
					
					if(cache.tag_search.search.length==list.length){
						var require_id=[];
						var option_id=[];
						for(var i in list){
							var data=list[i];
							var id=data.id;
							var name=data.name;
							var find=cache.tag_search.search.find(function(val){
								return val.name==name;
							});
							if(find.type){
								option_id.push(id);
							}else{
								require_id.push(id)
							}
						}
						// console.log(option_id,require_id)
						
						var wid=cache.webList.list[cache.webList.select].id
						var res=yield webRelation.getInter(require_id,option_id,wid);
		
						if(res.status){
							cache.tag_search.result=res.list.map(function(val){
								return val.source_id;
							});
							$scope.$apply()
						}else{
							yield Promise.reject("webRelation沒資料");
						}
					}else{
						yield Promise.reject("搜尋不存在的標籤");
					}
				}())
				.catch(function(message){
					cache.tag_search.result=[];
					$scope.$apply();
					// console.log(message)
				})
			},0);
		}
		
		
		
		$scope.add_tag_search=function(name){
			var index=cache.tag_search.absoluteSearch.findIndex(function(val){
				return val.name==name;
			})
			if(index==-1){
				cache.tag_search.absoluteSearch.push({name:name});
			}
		}
		$scope.del_tag_search=function(index){
			cache.tag_search.absoluteSearch.splice(index,1);
		}
		
		
		
	}],
})
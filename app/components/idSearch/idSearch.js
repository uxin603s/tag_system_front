angular.module('app').component("idSearch",{
bindings:{},
templateUrl:'app/components/idSearch/idSearch.html?t='+Date.now(),
controller:["$scope","cache","crud","tagName",
function($scope,cache,crud,tagName){
	$scope.cache=cache;
	cache.idSearch || (cache.idSearch={});
	cache.idSearch.search || (cache.idSearch.search=[]);
	cache.idSearch.selects || (cache.idSearch.selects=[]);
	cache.idSearch.img || (cache.idSearch.img=[]);
	cache.idSearch.title || (cache.idSearch.title=[]);
	var watch={};
	$scope.idSearch_func={
		get:function(){
			var self=this;
			promiseRecursive(function* (){
				$scope.result={};
				var wid=cache.webList.select;
				var where_list=[
					{field:'wid',type:0,value:wid},
				];
				for(var i in cache.idSearch.search){
					var id=cache.idSearch.search[i];
					where_list.push({field:'source_id',type:0,value:id})
					watch[id] && watch[id]();
					$scope.result[id]=[];
				}
				var res=yield crud.get("WebRelation",{where_list:where_list})
				if(res.status){
					res.list.sort(function(a,b){
						return a.sort_id-b.sort_id;
					})
					var ids=res.list.map(function(val){return val.tid})
					yield tagName.idToName(ids,1);
					
					for(var i in res.list){
						var data=res.list[i];
						var source_id=data.source_id;
						$scope.result[source_id].push(data)
					}
					for(var i in $scope.result){
						watch[i]=$scope.$watch("result["+i+"]",crud.sort.bind(this,'WebRelation','tid'),1)
					}
					$scope.$apply();
				}
			}())
		},
		add:function(id,tag){
			promiseRecursive(function* (){
				if(tag.name){
					var list=yield tagName.nameToId(tag.name)
					var tid=list[0].id;
				}else if(tag.id){
					var tid=tag.id;
				}else{
					return Promise.reject();
				}
				var index=$scope.result[id].findIndex(function(val){
					return val.tid==tid;
				})
				if(index==-1){
					var arg={
						tid:tid,
						source_id:id,
						wid:cache.webList.select,
						sort_id:$scope.result[id].length,
					}
					
					$scope.result[id].push(arg);
					crud.add('WebRelation',arg)
					cache.tagCount[tid] || (cache.tagCount[tid]=0);
					cache.tagCount[tid]++;
				}
				if(tag.name){
					tag.name='';
					$scope.$apply();
				}
			}())
		},
		del:function(id,index){
			watch[id] && watch[id]();
			var del=angular.copy($scope.result[id].splice(index,1).pop());
			crud.del('WebRelation',del)
			cache.tagCount[del.tid]--;
		},
		
	}
	
	$scope.select=function(id){
		var index=cache.idSearch.selects.indexOf(id);
		if(index==-1){
			cache.idSearch.selects.push(id)
		}else{
			cache.idSearch.selects.splice(index,1);
		}
	}
	var watch_selectList=function(){
		clearTimeout($scope.watch_selectList);
		$scope.watch_selectList=setTimeout(function(){
			var selectList=cache.selectList;
			for(var tid in selectList){
				if(cache.tagType.selects.indexOf(tid*1)==-1)continue;
				var data=selectList[tid][selectList[tid].length-1];
				if(data.select){
					if(cache.mode){
						var select=data.select
						for(var i in cache.idSearch.selects){
							var source_id=cache.idSearch.selects[i];
							$scope.idSearch_func.add(source_id,{id:select})
						}
						var insert=cache.tagName[select];
						if(insert){
							postMessageHelper.send('tagSystem',{name:'insert',value:insert})
						}
						delete data.select;
					}
				}
			}
		},0)
	}
	
	$scope.$watch("cache.selectList",watch_selectList,1);
	$scope.$watch("cache.mode",watch_selectList,1);
	
	var watch_search=function(){
		clearTimeout(cache.idSearch.search_timer)
		cache.idSearch.search_timer=setTimeout($scope.idSearch_func.get,0)
	}
	
	$scope.$watch("cache.webList.select",watch_search,1);
	$scope.$watch("cache.idSearch.search",watch_search,1);
	
	$scope.add=function(id){
		if(cache.idSearch.search.indexOf(id)==-1){
			cache.idSearch.search.push(id)
		}
	}
	$scope.del=function(index){
		var source_id=cache.idSearch.search.splice(index,1).pop();
	}
	$scope.$watch("result",function(value){
		clearTimeout($scope.watch_result);
		$scope.watch_result=setTimeout(function(){
			var result={};
			for(var i in value){
				result[i] || (result[i]=[])
				for(var j in value[i]){
					var tid=value[i][j].tid;
					var name=cache.tagName[tid]
					if(result[i].indexOf(name)==-1)
						result[i].push(name);
				}
			}
			postMessageHelper.send('tagSystem',{name:'idSearchTag',value:result})
		},0)
	},1);
	postMessageHelper.receive('tagSystem',function(res){
		if(res.name=="idSearchTag"){
			cache.idSearch.search.splice(0,cache.idSearch.search.length)
			for(var i in res.value){
				cache.idSearch.search.push(res.value[i].id);
				if(res.value[i].title)
					cache.idSearch.title.push(res.value[i].title);
				if(res.value[i].img)
					cache.idSearch.img.push(res.value[i].img);
			}
		}
		if(res.name=="idSearchSelect"){
			cache.idSearch.selects.splice(0,cache.idSearch.selects.length)
			for(var i in res.value){
				cache.idSearch.selects.push(res.value[i]);
			}
		}
		if(res.name=="addIdRelation"){
			var id=res.value.id;
			var name=res.value.name;
			$scope.idSearch_func.add(id,{name:name})
		}
		if(res.name=="delIdRelation"){
			var id=res.value.id;
			var index=res.value.index;
			$scope.idSearch_func.del(id,index)
		}
		if(res.name=="chIdRelation"){
			var id=res.value.id;
			var a=res.value.a;
			var b=res.value.b;
			var sort_id=$scope.result[id][a].sort_id
			$scope.result[id][a].sort_id=$scope.result[id][b].sort_id
			$scope.result[id][b].sort_id=sort_id;
			$scope.result[id].sort(function(a,b){
				return a.sort_id-b.sort_id
			})
		}
		
		$scope.$apply();
	});
	
}],
})
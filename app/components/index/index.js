angular.module('app').component("index",{
bindings:{},
templateUrl:'app/components/index/index.html?t='+Date.now(),
controller:['$scope','tagName','crud',"idSearch",
function($scope,tagName,crud,idSearch){
	
	$scope.document=document;
	var w,h;
	window.onresize=function(){
		if(w==$scope.document.documentElement.scrollWidth)
		if(h==$scope.document.documentElement.scrollHeight)
			return ;
		w=$scope.document.documentElement.scrollWidth;
		h=$scope.document.documentElement.scrollHeight;
		clearTimeout($scope.resizeTimer)
		$scope.resizeTimer=setTimeout(function(){
			postMessageHelper.send('tagSystem',{
				name:'resize',
				value:{
					w:w,
					h:h,
				},
			})
			$scope.$apply();
		},0)
	}
	$scope.$watch("document.documentElement.scrollWidth",window.onresize);
	$scope.$watch("document.documentElement.scrollHeight",window.onresize);
	
	var watch_clickSearch=function(){
		clearTimeout($scope.selectListTimer);
		$scope.selectListTimer=setTimeout(function(){
			$scope.cache.clickSearch=[];
			var send={};
			var selectList=$scope.cache.selectList
			for(var tid in selectList){
				if($scope.cache.tagType.selects.indexOf(tid*1)==-1)continue;
				if(!selectList[tid].length)continue;
				var select=selectList[tid][selectList[tid].length-1].select;
				
				
				if(select){
					var name=$scope.cache.tagName[select]
					$scope.cache.clickSearch.push({id:select,name:name})
				}else{
					var data=selectList[tid][selectList[tid].length-2];
					if(data){
						var select=data.select;
						// console.log($scope.cache.levelList[tid][$scope.cache.levelList[tid].length-1])
						if(select){
							var level_id=$scope.cache.levelList[tid][$scope.cache.levelList[tid].length-1].id
							var select_name=$scope.cache.tagName[select];
							send[select_name]=[select_name];
							if($scope.cache.relation[level_id]){
								var list=$scope.cache.relation[level_id][select];
								for(var i in list){
									var id=list[i].child_id;
									var name=$scope.cache.tagName[id]
									$scope.cache.clickSearch.push({id:id,name:name,type:1});
									send[select_name].push(name);
								}
							}
						}
					}
				}
				if($scope.cache.levelList[tid].length==1){
					var select_name=$scope.cache.tagType.name[tid];
					send[select_name]=[select_name];
					var level_id=$scope.cache.levelList[tid][0].id
					if($scope.cache.relation[level_id]){
						var list=$scope.cache.relation[level_id][0];
						for(var i in list){
							var id=list[i].child_id;
							var name=$scope.cache.tagName[id]
							send[select_name].push(name);
						}
					}
				}
			}
			postMessageHelper.send('tagSystem',{name:'getInsertList',value:send})
			$scope.$apply();
		},50)
	}
	$scope.$watch("cache.tagType.selects",watch_clickSearch,1)
	$scope.$watch("cache.webList.select",watch_clickSearch,1)
	$scope.$watch("cache.selectList",watch_clickSearch,1)
	$scope.$watch("cache.relation",watch_clickSearch,1)
	
	
	$scope.cache.clickSearch || ($scope.cache.clickSearch=[]);
	$scope.cache.absoluteSearch || ($scope.cache.absoluteSearch=[]);
	
	var getInter=function(){
		
		clearTimeout($scope.getInterTimer);
		$scope.getInterTimer=setTimeout(function(){
			promiseRecursive(function* (){
				var require=[];
				var require_tmp=[];
				var option=[];
				var option_tmp=[];
				
				var process=function(val){
					var type=val.type;
					var id=val.id;
					var name=val.name;
					if(type){
						if(id){
							option.push(id)
						}else{
							option_tmp.push(name)
						}
					}else{
						if(id){
							require.push(id)
						}else{
							require_tmp.push(name)
						}
					}
				}
				// console.log('clickSearch',$scope.cache.clickSearch)
				// console.log('absoluteSearch',$scope.cache.absoluteSearch)
				$scope.cache.clickSearch.map(process)
				$scope.cache.absoluteSearch.map(process)
				
				var names=require_tmp.concat(option_tmp);
				if(names.length){
					yield tagName.nameToId(names,1);
					for(var i in require_tmp){
						var id=$scope.cache.tagNameR[require_tmp[i]];
						if(require.indexOf(id)==-1)
							require.push(id);
					}
					for(var i in option_tmp){
						var id=$scope.cache.tagNameR[option_tmp[i]];
						if(option.indexOf(id)==-1)
							option.push(id);
					}
				}
				var tmp=[];
				for(var i in $scope.cache.absoluteSearch){
					tmp.push($scope.cache.tagNameR[$scope.cache.absoluteSearch[i].name]);
				}
				idSearch.getCount(tmp)
				// console.log(tmp)
				// console.log(require,option,$scope.cache.mode)
				return idSearch.getInter(require,option,$scope.cache.mode)
				.then(function(ids){
					// console.log(ids);
					postMessageHelper
						.send("tagSystem",{name:'tagSearchId',value:ids})
				});
				
				
			}())
			.catch(function(message){
				postMessageHelper
						.send("tagSystem",{name:'tagSearchId',value:[]})
			})
		},0)
	}
	$scope.$watch("cache.webList.select",getInter,1)
	$scope.$watch("cache.clickSearch",getInter,1);
	$scope.$watch("cache.absoluteSearch",getInter,1);
	$scope.$watch("cache.mode",getInter,1);
	var time={}
	postMessageHelper.receive('tagSystem',function(res){
		clearTimeout(time[res.name])
		time[res.name]=setTimeout(function(){
			time[res.name]=setInterval(function(){
				if($scope.cache.webList && $scope.cache.webList.select){
					clearTimeout(time[res.name])
					if(res.name=="idSearchTag"){
						idSearch.get(res.value)
						.then(function(res){
							var names={};
							for(var i in res){
								names[i]=res[i].map(function(val){
									return $scope.cache.tagName[val.tid];
								})
							}
							postMessageHelper
								.send("tagSystem",{name:'idSearchTag',value:names})
						});
					}
					if(res.name=="addIdRelation"){
						var id=res.value.id;
						var name=res.value.name;
						idSearch.add(id,{name:name})
						.then(function(res){
							var names={};
							for(var i in res){
								names[i]=res[i].map(function(val){
									return $scope.cache.tagName[val.tid];
								})
							}
							postMessageHelper
								.send("tagSystem",{name:'idSearchTag',value:names})
						});
					}
					if(res.name=="delIdRelation"){
						var id=res.value.id;
						var index=res.value.index;
						idSearch.del(id,index).then(function(res){
							var names={};
							for(var i in res){
								names[i]=res[i].map(function(val){
									return $scope.cache.tagName[val.tid];
								})
							}
							postMessageHelper
								.send("tagSystem",{name:'idSearchTag',value:names})
						});
					}
					
					if(res.name=="searchTagName"){
						if(res.value){
							var send={};
							var key_name="%"+res.value+"%";
							tagName.nameToId(key_name,1)
							.then(function(list){
								var value=list.map(function(val){
									return val.name;
								})
								send[key_name]=value;
								postMessageHelper
									.send("tagSystem",{name:'searchTagName',value:send})
							})
						}
					}
					
					if(res.name=="tagSearchId"){
						$scope.cache.absoluteSearch.splice(0,$scope.cache.absoluteSearch.length);
						for(var i in res.value){
							$scope.cache.absoluteSearch.push({name:res.value[i]});
						}
					}
					
					
					if(res.name=="setMode"){
						$scope.cache.mode=res.value;						
					}
					if(res.name=="post"){
						var request=res.value.request;
						var id=res.value.id;
						$.post("ajax.php",request,function(res){
							postMessageHelper
								.send("tagSystem",{name:'post',value:{id:id,value:res}})

						},"json")
					}
					$scope.$apply();
				}
			},0)
		},0);
	});
}],
})


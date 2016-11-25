angular.module('app').component("index",{
	bindings:{},
	templateUrl:'app/components/index/index.html?t='+Date.now(),
	controller:['$scope','cache',
	function($scope,cache){
		$scope.cache=cache;
		return
		//idRelation,tagRelation
		//'idRelation',"tagRelation",
		
		
		postMessageHelper.receive("tagSystem",function(res){
			var getTag_timer=setInterval(function(){
				if(cache.webList && cache.webList.list[cache.webList.select]){
					clearTimeout(getTag_timer);
					var wid=cache.webList.list[cache.webList.select].id
					if(res.name=="getTag"){
						idRelation.get(res.value,wid)
						.then(function(res){
							
							var list=angular.copy(res);
							var result={};
							for(var i in list){
								result[i]=[];
								for(var j in list[i]){
									result[i].push(cache.tagName[list[i][j].tid]);
								}
							}
							// console.log(result)
							// return
							postMessageHelper.send("tagSystem",{name:"getTag",value:result})
						});
					}
					else if(res.name=="addTag"){
						idRelation.add(res.value.name,res.value.id,level_id,wid);
					}
					else if(res.name=="delTag"){
						// console.log(res.value)
						idRelation.del(res.value.index,res.value.id);
					}
				}
			},0)
			$scope.$apply();
		})
		var watch_selectList;
		$scope.$watch("cache.selectList",function(selectList){
			return
			if(!selectList)return;
			clearTimeout(watch_selectList)
			watch_selectList=setTimeout(function(){
				
				var selectTag;
				for(var i in selectList){
					var data=selectList[i][selectList[i].length-2];
					if(data.select){
						tagRelation
						.get_list(data.select,cache.levelList.length-1)
						.then(function(data,res){
							if(!res.status){
								selectTag=cache.tagName[data.select];
								delete data.select
								if(selectTag){
									console.log(selectTag)
									// postMessageHelper.send("tagSystem",{name:"selectTag",value:selectTag})
								}
							}
							// console.log(res.status)
						}.bind(this,data))
						
					}
					
					var data=selectList[i][selectList[i].length-1];
					
					if(data.select){
						selectTag=cache.tagName[data.select];
						delete data.select
						break;
					}
				}
				
				if(selectTag){
					console.log(selectTag)
					// postMessageHelper.send("tagSystem",{name:"selectTag",value:selectTag})
				}
				
			},0)
			
			
		},1)
	
		$scope.$watch("cache.tag_search.result",function(value){
			if(!value)return;
			postMessageHelper.send('tagSystem',{name:'search',value:value})
		})
		$scope.document=document.documentElement;
		window.onresize=function(){
			clearTimeout($scope.resizeTimer)
			$scope.resizeTimer=setTimeout(function(){
				cache.width=$scope.document.scrollWidth;
				cache.height=$scope.document.scrollHeight;
				// console.log(cache.width,cache.height)
				postMessageHelper.send('tagSystem',{
					name:'resize',
					value:{
						w:cache.width,
						h:cache.height,
					},
				})
				$scope.$apply();
			},0)
		}
		
		$scope.$watch("document.scrollWidth",window.onresize);
		$scope.$watch("document.scrollHeight",window.onresize);
		$scope.$watch("cache.editMode",window.onresize);
	}],
})


angular.module('app').component("webTagType",{
	bindings:{},
	templateUrl:'app/components/webTagType/webTagType.html?t='+Date.now(),
	controller:
	["$scope","cache","webList","tagType",
	function($scope,cache,webList,tagType){
		$scope.cache=cache;
		cache.webList || (cache.webList={});
		cache.tagType || (cache.tagType={});
		cache.webTagType || (cache.webTagType={});
		
		$scope.$watch("cache.webList.list",webList.ch,1)
		$scope.get=function(){
			promiseRecursive(function* (){
				var res=yield webList.get();
				if(res.status){
					cache.webList.list=res.list;
					$scope.$apply();
				}
			}())
			promiseRecursive(function* (){
				var res=yield tagType.get();
				if(res.status){
					cache.tagType.list=res.list;
					$scope.$apply();
				}
			}())
		}
		$scope.$watch("cache.webList.select",function(wid){
			if(wid){
				var post_data={
					func_name:'webTagType::getList',
					arg:{
						where_list:[
							{field:'wid',type:0,value:wid},
						]
					}
				}
				$.post("../tag_system_backend/ajax.php",post_data,function(res){
					
					if(res.status){
						cache.webTagType.list=res.list;
					}else{
						cache.webTagType.list=[];
					}
					$scope.$apply();
				},"json")
				
			}else{
				cache.webTagType.list=[];
			}
		})
		
		$scope.get();
		
		$scope.relation=function(tid){
			var wid=cache.webList.select;
			if(!wid)return;
			var index=cache.webTagType.list.findIndex(function(val){
				return val.tid==tid;
			})
			
			if(index==-1){
				var arg={
					wid:wid,
					tid:tid,
					sort_id:cache.webTagType.list.length,
				}
				var post_data={
					func_name:'webTagType::insert',
					arg:arg
				}
				$.post("../tag_system_backend/ajax.php",post_data,function(res){
					if(res.status){
						cache.webTagType.list.push(arg);
						$scope.$apply();
					}
				},"json")
			}else{
				var arg=cache.webTagType.list.splice(index,1).pop();
				var post_data={
					func_name:'webTagType::delete',
					arg:arg,
				}
				$.post("../tag_system_backend/ajax.php",post_data,function(res){
					if(res.status){
						$scope.$apply();
					}
				},"json")
			}
		}
		$scope.$watch("cache.webTagType.list",function(webTagType){
			
			$scope.list=[];
			$scope.not_list=[];
			for(var i in cache.tagType.list){
				var data=angular.copy(cache.tagType.list[i]);
				var index=webTagType.findIndex(function(val){
					return val.tid==data.id
				})
				if(index==-1){
					$scope.not_list.push(data);
				}else{
					data.sort_id=webTagType[index].sort_id;
					$scope.list.push(data);
				}
			}
			$scope.list.sort(function(a,b){
				return a.sort_id-b.sort_id;
			})
		},1)
		
	}],
})


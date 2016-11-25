angular.module('app').component("webTagType",{
	bindings:{},
	templateUrl:'app/components/webTagType/webTagType.html?t='+Date.now(),
	controller:
	["$scope","cache","crud",
	function($scope,cache,crud){
		
		$scope.cache=cache;
		cache.webList || (cache.webList={});
		cache.tagType || (cache.tagType={});
		cache.webTagType || (cache.webTagType={});
		cache.tagType.selects || (cache.tagType.selects=[])
		cache.relation || (cache.relation={})
		cache.selectList || (cache.selectList={})
		$scope.$watch("cache.webList.list",crud.sort.bind(this,'WebList','id'),1)
		$scope.$watch("cache.tagType.list",crud.sort.bind(this,'TagType','id'),1)
		$scope.$watch("list",crud.sort.bind(this,'WebTagType','tid'),1);
		var sort=function(a,b){
			return a.sort_id-b.sort_id;
		}
		$scope.get=function(){
			promiseRecursive(function* (){
				var res=yield crud.get('WebList');
				if(res.status){
					res.list.sort(sort)
					cache.webList.list=res.list;
					$scope.$apply();
				}
			}())
			promiseRecursive(function* (){
				var res=yield crud.get('TagType');
				if(res.status){
					res.list.sort(sort)
					cache.tagType.list=res.list;
					cache.tagType.name={};
					for(var i in res.list){
						var data=res.list[i];
						cache.tagType.name[data.id]=data.name;
					}
					$scope.$apply();
				}
			}())
		}
		$scope.$watch("cache.webList.select",function(wid){
			if(wid){
				var where_list=[
					{field:'wid',type:0,value:wid},
				];
				crud.get('WebTagType',{where_list:where_list})
				.then(function(res){
					if(res.status){
						cache.webTagType.list=res.list;
					}else{
						cache.webTagType.list=[];
					}
					$scope.$apply();
				})
			}else{
				cache.webTagType.list=[];
			}
		})
		
		$scope.get();
		
		$scope.relation=function(tid){
			var wid=cache.webList.select;
			if(wid){
				var index=cache.webTagType.list.findIndex(function(val){
					return val.tid==tid;
				})
				if(index==-1){
					var arg={
						wid:wid,
						tid:tid,
						sort_id:cache.webTagType.list.length,
					}
					cache.webTagType.list.push(arg);
					crud.add('WebTagType',arg);
				}else{
					var arg=angular.copy(cache.webTagType.list.splice(index,1).pop());
					crud.del('WebTagType',arg)
				}
			}else{
				var index=cache.tagType.selects.indexOf(tid);
				if(index==-1){
					cache.tagType.selects.push(tid);
				}else{
					cache.tagType.selects.splice(index,1);
				}
			}
		}
		
		var watch=function(){
			$scope.list=[];
			$scope.not_list=[];
			cache.tagType.selects=[];
			if(!cache.webTagType.list.length)return
			// clearTimeout($scope.timer)
			// $scope.timer=setTimeout(function(){
				
				for(var i in cache.tagType.list){
					var data=angular.copy(cache.tagType.list[i]);
					var index=cache.webTagType.list.findIndex(function(val){
						return val.tid==data.id;
					})
					if(index==-1){
						$scope.not_list.push(data);
					}else{
						$scope.list.push(cache.webTagType.list[index]);
					}
					cache.tagType.name[data.id]=data.name;
				}
				$scope.list.sort(sort);
				cache.tagType.selects=$scope.list.map(function(val){
					return val.tid;
				})
			// },0)
		}
		
		$scope.$watch("cache.webTagType.list",watch,1)
		$scope.$watch("cache.tagType.list",watch,1)
		$scope.add=function(name,list,data){
			var arg={
				name:data.name,
				sort_id:list.length,
			}
			
			crud.add(name,arg)
			.then(function(res){
				if(res.status){
					list.push(res.insert);
					$scope.$apply();
				}
			})
			data.name='';
		}
		$scope.del=function(name,list,index){
			var arg=angular.copy(list.splice(index,1).pop());
			crud.del(name,arg)
		}
	}],
})


angular.module('app').component("webTagType",{
	bindings:{},
	templateUrl:'app/components/webTagType/webTagType.html?t='+Date.now(),
	controller:
	["$scope","crud",
	function($scope,crud){
		if(location.search.match(/wid=(\d+)/)){
			$scope.web_hidden=true;
			$scope.cache.webList.select=RegExp.$1;
		}else{
			$scope.web_hidden=false;
		}
		$scope.cache.tagCount || ($scope.cache.tagCount={});
		$scope.cache.levelList || ($scope.cache.levelList={});
		$scope.cache.webList || ($scope.cache.webList={});
		$scope.cache.webList.list || ($scope.cache.webList.list=[]);
		$scope.cache.tagType || ($scope.cache.tagType={});
		$scope.cache.tagType.list || ($scope.cache.tagType.list=[]);
		
		$scope.cache.webTagType || ($scope.cache.webTagType={});
		$scope.cache.tagType.selects || ($scope.cache.tagType.selects=[])
		$scope.cache.relation || ($scope.cache.relation={})
		$scope.cache.selectList || ($scope.cache.selectList={})
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
					$scope.cache.webList.list=res.list;
				}else{
					$scope.cache.webList.list=[];
				}
				
				$scope.$apply();
			}())
			promiseRecursive(function* (){
				var res=yield crud.get('TagType');
				if(res.status){
					res.list.sort(sort)
					$scope.cache.tagType.list=res.list;
					$scope.cache.tagType.name={};
					for(var i in res.list){
						var data=res.list[i];
						$scope.cache.tagType.name[data.id]=data.name;
					}
					
				}else{
					$scope.cache.tagType.list=[];
				}
				$scope.$apply();
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
						$scope.cache.webTagType.list=res.list;
					}else{
						$scope.cache.webTagType.list=[];
					}
					$scope.$apply();
				})
			}else{
				$scope.cache.webTagType.list=[];
			}
		})
		
		$scope.get();
		
		$scope.relation=function(tid){
			// console.log(tid)
			var wid=$scope.cache.webList.select;
			if(wid){
				var index=$scope.cache.webTagType.list.findIndex(function(val){
					return val.tid==tid;
				})
				if(index==-1){
					var arg={
						wid:wid,
						tid:tid,
						sort_id:$scope.cache.webTagType.list.length,
					}
					$scope.cache.webTagType.list.push(arg);
					crud.add('WebTagType',arg);
				}else{
					var arg=angular.copy($scope.cache.webTagType.list.splice(index,1).pop());
					crud.del('WebTagType',arg)
				}
			}else{
				var index=$scope.cache.tagType.selects.indexOf(tid);
				if(index==-1){
					$scope.cache.tagType.selects.push(tid);
				}else{
					$scope.cache.tagType.selects.splice(index,1);
				}
			}
		}
		
		var watch=function(){
			$scope.list=[];
			$scope.not_list=[];
			$scope.cache.tagType.selects=[];
			// $scope.cache.tagType.selects=$scope.cache.tagType.list.map(function(val){
				// return val.id;
			// });
			if(!$scope.cache.webTagType.list.length)return
			if(!$scope.cache.tagType.list.length)return
			
			for(var i in $scope.cache.tagType.list){
				var data=angular.copy($scope.cache.tagType.list[i]);
				var index=$scope.cache.webTagType.list.findIndex(function(val){
					return val.tid==data.id;
				})
				if(index==-1){
					$scope.not_list.push(data);
				}else{
					$scope.list.push($scope.cache.webTagType.list[index]);
				}
				$scope.cache.tagType.name[data.id]=data.name;
			}
			$scope.list.sort(sort);
			$scope.cache.tagType.selects=$scope.list.map(function(val){
				return val.tid;
			})
			
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
					$scope.cache.tagType.name[res.insert.id]=res.insert.name;
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


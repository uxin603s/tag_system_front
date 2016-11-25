angular.module('app').component("tagLevel",{
	bindings:{},
	templateUrl:'app/components/tagLevel/tagLevel.html?t='+Date.now(),
	controller:
	["$scope","cache","tagName",
	function($scope,cache,tagName){
		$scope.cache=cache;
		cache.count || (cache.count={})
		cache.relation || (cache.relation={})
		cache.selectList || (cache.selectList=[]);
		cache.clickSearch || (cache.clickSearch=[])
		
		$scope.get=function(){
			var post_data={
				func_name:'TagLevel::getList',
				arg:{
					tid:cache.tagType.list[cache.tagType.select].id,
				},
			}
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					
					cache.levelList=res.list;
					var count=res.list.length;
					cache.selectList=[];
					for(var i=0;i<count;i++){
						cache.selectList.push({})
					}
					
				}else{
					cache.selectList=[]
					cache.levelList=[];
					cache.count={};
					cache.relation={};
				}
				$scope.$apply();
			},"json")
		}
		$scope.get();
		$scope.add=function(){
			var post_data={
				func_name:'TagLevel::insert',
				arg:{
					tid:cache.tagType.list[cache.tagType.select].id,
					sort_id:cache.levelList.length || 0,
				},
			}
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					cache.levelList.push(res.insert);
				}
				$scope.$apply();
			},"json")
		}
		$scope.del=function(index){
			
			var post_data={
				func_name:'TagLevel::delete',
				arg:{
					id:cache.levelList[index].id,
					tid:cache.tagType.list[cache.tagType.select].id,
				},
			}
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					cache.levelList.splice(index,1);
					$scope.$apply();
				}
			},"json")
		}
		
	}]
});
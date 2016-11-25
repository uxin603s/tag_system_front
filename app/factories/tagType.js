angular.module('app').factory('tagType',
["$rootScope","cache",
function($rootScope,cache){
	var get=function(){
		return new Promise(function(resolve,reject){
			var post_data={
				func_name:'TagType::getList',
				arg:{}
			}
			$.post("../tag_system_backend/ajax.php",post_data,function(res){
				resolve(res)
				$rootScope.$apply();
			},"json")
		})
	}
	return {
		get:get,
	};
	
	$scope.cache=cache;
		$scope.add_relation=function(){
			var wid=cache.webList.list[cache.webList.select].id
			console.log()
		}
		$scope.del_relation=function(){
			var wid=cache.webList.list[cache.webList.select].id
			console.log()
		}
		
		location.search.match(/tid=(\d+?)/g)
		if(RegExp.$1){
			$scope.uri_tid=RegExp.$1
		}
		
		
		
		$scope.add=function(tagType){
			var post_data={
				func_name:'TagType::insert',
				arg:{
					name:tagType.name,
					sort_id:$scope.cache.tagType.list.length
				}
			}
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					$scope.cache.tagType.list.push(res.insert)
					tagType.name='';
				}
				$scope.$apply();
			},"json")
		}
		
		$scope.del=function(index){
			if(!confirm("確認刪除?"))return;
			var post_data={
				func_name:'TagType::delete',
				arg:{
					id:$scope.cache.tagType.list[index].id,
				}
			}
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					$scope.cache.tagType.list.splice(index,1);
					$scope.$apply();
				}
			},"json")
		}
		$scope.get();
		$scope.$watch("cache.tagType.list",function(curr,prev){
			if(!curr)return;
			if(!prev)return;
			if(curr.length!=prev.length)return;
			
			for(var i in curr){
				
				if(curr[i].lock_lv1!=prev[i].lock_lv1){
					var post_data={
						func_name:'TagType::update',
						arg:{
							update:{
								lock_lv1:curr[i].lock_lv1,
							},
							where:{
								id:curr[i].id,
							}
						}
					}
					$.post("ajax.php",post_data,function(res){
						// console.log(res)
					},"json")
				}
				if(curr[i].id!=prev[i].id){
					var post_data={
						func_name:'TagType::update',
						arg:{
							update:{
								sort_id:i,
							},
							where:{
								id:curr[i].id,
							}
						}
					}
					$.post("ajax.php",post_data,function(i,res){
						if(res.status){
							curr[i].sort_id=i
							$scope.$apply();
						}
					}.bind(this,i),"json")
				}
			}
		},1)
}])
angular.module('app').factory('webList',
["$rootScope","cache",
function($rootScope,cache){
	var get=function(){
		return new Promise(function(resolve,reject){
			var post_data={
				func_name:'WebList::getList',
				arg:{}
			}
			$.post("../tag_system_backend/ajax.php",post_data,function(res){
				resolve(res)
				$rootScope.$apply();
			},"json")
		})
	}
	var add=function(arg){
		return new Promise(function(resolve,reject){
			var post_data={
				func_name:'WebList::insert',
				arg:arg,
			}
			$.post("../tag_system_backend/ajax.php",post_data,function(res){
				resolve(res)
				$rootScope.$apply();
			},"json")
		})
	}
	var del=function(){
		return new Promise(function(resolve,reject){
			var post_data={
				func_name:'WebList::delete',
				arg:arg,
			}
			$.post("../tag_system_backend/ajax.php",post_data,function(res){
				resolve(res)
				$rootScope.$apply();
			},"json")
		})
	}
	var ch=function(curr,prev){
		
		for(var i in curr){
			// console.log(curr[i].id,prev[i].id)
			if(curr[i].id!=prev[i].id){
				var where={
					id:curr[i].id,
				}
				var update={
					sort_id:i
				};
				
				
				curr[i].sort_id=i;
				
				var post_data={
					func_name:'WebList::update',
					arg:{
						update:update,
						where:where,
					}
				}
				$.post("../tag_system_backend/ajax.php",post_data,function(res){
					console.log(res)
				},"json")
			}
		}
	}
	return {
		get:get,
		add:add,
		del:del,
		ch:ch,
	}
}])
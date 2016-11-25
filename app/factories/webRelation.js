angular.module('app').factory('webRelation',
["$rootScope","cache",function($rootScope,cache){
	var getInter=function(require_id,option_id,wid){
		return new Promise(function(resolve,reject){
			var post_data={
				func_name:'WebRelation::getIntersection',
				arg:{
					require_id:require_id,
					option_id:option_id,
					wid:wid,
				},
			}
			$.post("../tag_system_backend/ajax.php",post_data,function(res){
				resolve(res);
				$rootScope.$apply();
			},"json");
		});
	}
	var get=function(where_list){
		return new Promise(function(resolve,reject) {
			var post_data={
				func_name:'WebRelation::getList',
				arg:{
					where_list:where_list,
				},
			}
			$.post("../tag_system_backend/ajax.php",post_data,function(res){
				resolve(res)
				$rootScope.$apply();
			},"json")
		});
	}
	var add=function(arg){
		
		return new Promise(function(resolve,reject) {
			var post_data={
				func_name:'WebRelation::insert',
				arg:arg,
			}
			$.post("../tag_system_backend/ajax.php",post_data,function(res){
				if(res.status){
					if(!cache.tagCount[res.insert.tid]){
						cache.tagCount[res.insert.tid]=0;
					}
					cache.tagCount[res.insert.tid]++;
				}
				resolve(res);
				
				$rootScope.$apply();
			},"json")
		})
	}
	var del=function(arg){
		return new Promise(function(resolve,reject) {
			var post_data={
				func_name:'WebRelation::delete',
				arg:arg,
			}
			$.post("../tag_system_backend/ajax.php",post_data,function(res){
				if(res.status){
					if(cache.tagCount[res.delete.tid]){
						cache.tagCount[res.delete.tid]--;
					}
				}
				resolve(res);
				$rootScope.$apply();
			},"json")
			
		});
	}
	
	var ch=function(arg){
		return new Promise(function(resolve,reject) {
			var post_data={
				func_name:'WebRelation::update',
				arg:arg,
			}
			$.post("../tag_system_backend/ajax.php",post_data,function(res){
				resolve(res);
				$rootScope.$apply();
			},"json")
		});
	}
	
	var getCount=function(tid_arr){
		
		return new Promise(function(resolve,reject) {
			var post_data={
				func_name:'WebRelation::getCount',
				arg:{
					tid_arr:tid_arr,
					wid:cache.webList.list[cache.webList.select].id,
					require_id:cache.require_id,
					option_id:cache.option_id,
				},
			}
			// console.log(post_data.arg.require_id)
			// console.log(post_data.arg.option_id)
			$.post("../tag_system_backend/ajax.php",post_data,function(res){
				for(var i in cache.tagCount){
					delete cache.tagCount[i];
				}
				if(res.status){
					for(var i in res.list){
						cache.tagCount[i]=res.list[i]
					}
					// console.log(cache.tagCount)
				}
				resolve(res);
				$rootScope.$apply();
			},"json")
		});
	}
	return {
		add:add,
		del:del,
		get:get,
		ch:ch,
		getInter:getInter,
		getCount:getCount,
	}
}])
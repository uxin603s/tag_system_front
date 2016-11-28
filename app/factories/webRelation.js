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
	var getCount=function(wid,require_id){
		
		return new Promise(function(resolve,reject) {
			var post_data={
				func_name:'WebRelation::getCount',
				arg:{
					wid:wid,
					require_id:require_id,
				},
			}
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
				// resolve(res);
				$rootScope.$apply();
			},"json")
		});
	}
	return {
		
		getInter:getInter,
		getCount:getCount,
	}
}])
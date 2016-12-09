angular.module('app').factory('crud',
["$rootScope",function($rootScope){
	var get=function(name,arg){
		return new Promise(function(resolve,reject) {
			var post_data={
				func_name:name+'::getList',
				arg:arg,
			}
			
			$.post("ajax.php",post_data,function(res){
				if(res.status){
					res.list.sort(function(a,b){
						return a.sort_id-b.sort_id;
					})
				}
				resolve(res)
				$rootScope.$apply();
			},"json")
		});
	}
	var add=function(name,arg){
		return new Promise(function(resolve,reject) {
			var post_data={
				func_name:name+'::insert',
				arg:arg,
			}
			$.post("ajax.php",post_data,function(res){
				resolve(res);
				$rootScope.$apply();
			},"json")
		})
	}
	var del=function(name,arg){
		return new Promise(function(resolve,reject) {
			var post_data={
				func_name:name+'::delete',
				arg:arg,
			}
			$.post("ajax.php",post_data,function(res){
				resolve(res);
				$rootScope.$apply();
			},"json")
			
		});
	}
	
	var ch=function(name,arg){
		return new Promise(function(resolve,reject) {
			var post_data={
				func_name:name+'::update',
				arg:arg,
			}
			$.post("ajax.php",post_data,function(res){
				resolve(res);
				$rootScope.$apply();
			},"json")
		});
	}
	
	var sort=function(name,compare_field,curr,prev){
		if(!compare_field)return;
		if(!curr)return;
		if(!prev)return;
		if(curr.length!=prev.length)return;
		for(var i in curr){
			if(!prev[i])continue;
			if(curr[i][compare_field]==prev[i][compare_field])continue;
				
			var where=angular.copy(curr[i])
			
			delete where.sort_id;
			var update={
				sort_id:i
			};
			curr[i].sort_id=i;
			var arg={where:where,update:update}
			ch(name,arg)
			.then(function(res){
				$rootScope.$apply();
			})
		}
	}
	return {
		add:add,
		del:del,
		get:get,
		ch:ch,
		sort:sort,
	}
}])
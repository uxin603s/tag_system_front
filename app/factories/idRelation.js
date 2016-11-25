angular.module('app').factory('idRelation',
["$rootScope","cache","tagName","webRelation",
function($rootScope,cache,tagName,webRelation){
	
	var result={};
	var search=[];
	
	var add=function(name,source_id,wid){
		return promiseRecursive(function* (){
			
			var list=yield tagName.nameToId(name);
			var add={
				tid:list[0].id,
				wid:wid,
				source_id:source_id,
				sort_id:result[source_id].length,
			};
			var res=yield webRelation.add(add);
			if(res.status){
				result[source_id].push(add);
				result[source_id].map(function(val,key){
					val.sort_id=key
				})
				result[source_id].sort(function(a,b){
					return a.sort_id-b.sort_id;
				})
				$rootScope.$apply();
			}
		}());
	}
	var del=function(index,source_id){
		// if(!confirm("確認刪除關聯?"))return;
		var del=angular.copy(result[source_id][index]);
		
		webRelation.del(del).then(function(){
			result[source_id].splice(index,1);
			$rootScope.$apply();
		})
	}
	var ch=function(curr,prev){
		if(!curr)return;
		if(!prev)return;
		
		for(var i in curr){
			if(curr[i])
			if(prev[i])
			if(curr[i].tid!=prev[i].tid){
				var where=angular.copy(curr[i]);
				delete where.sort_id
				var ch={
					update:{
						sort_id:i
					},
					where:where,
				}
				curr[i].sort_id=i
				
				webRelation.ch(ch)
				.then(function(res){
					console.log(res)
				});
			}
		}
	}
	
	var get=function(ids,wid){
		return new Promise(function(resolve){
			return promiseRecursive(function* (){
				var tmp_result={};
				for(var i in ids){
					var id=ids[i];
					var where_list=[
						{field:'wid',type:0,value:wid},
						{field:'source_id',type:0,value:id},
					];
					webRelation.get(where_list)
					.then(function(id,res){
						
						if(res.status){
							return tagName.idToName(res.list.map(function(val){
								return val.tid;
							}))
							.then(function(id){
								tmp_result[id]=res.list
							}.bind(this,id))
							
							
						}else{
							tmp_result[id]=[];
						}
						return id;
					}.bind(this,id))
					.then(function(id){
						if(Object.keys(tmp_result).length==ids.length){
							for(var i in tmp_result){
								result[i]=tmp_result[i];
							}
							$rootScope.$apply();
							resolve(tmp_result);
						}
					})
				}
			}())
		})
	}
	return {
		add:add,
		del:del,
		ch:ch,
		get:get,
		search:search,
		result:result,
	}
}])
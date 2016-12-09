angular.module('app').factory('idSearch',
["$rootScope","crud","tagName",function($rootScope,crud,tagName){
	var result={};
	var get=function(ids,callback){
		return promiseRecursive(function* (ids){
			for(var i in result){
				delete result[i];
			}
			var wid=$rootScope.cache.webList.select;
			var where_list=[
				{field:'wid',type:0,value:wid},
			];
			// console.log(ids)
			for(var i in ids){
				var source_id=ids[i];
				where_list.push({field:'source_id',type:0,value:source_id});
				result[source_id]=[];
			}
			var res=yield crud.get("WebRelation",{where_list:where_list});
			
			if(res.status){
				res.list.sort(function(a,b){
					return a.sort_id-b.sort_id;
				})
				var ids=res.list.map(function(val){return val.tid})
				yield tagName.idToName(ids,1);
				
				for(var i in res.list){
					var data=res.list[i];
					var tid=data.tid;
					var source_id=data.source_id;
					// data.name=$rootScope.cache.tagName[tid];
					result[source_id] || (result[source_id]=[]);
					result[source_id].push(data)
				}
			}
			
			return Promise.resolve(result);
		}.bind(this,ids)());
	}
	var add=function(id,tag){
		return promiseRecursive(function* (){
			if(!tag.name){
				return Promise.reject();
			}
			
			var index=result[id].findIndex(function(val){
				return val==tag.name;
			})
			if(index==-1){
				var list=yield tagName.nameToId(tag.name)
				var tid=list[0].id;
				var arg={
					tid:tid,
					source_id:id,
					wid:$rootScope.cache.webList.select,
					sort_id:result[id].length,
				}
				
				result[id].push(arg);
				crud.add('WebRelation',arg)
				$rootScope.cache.tagCount[tid] || ($rootScope.cache.tagCount[tid]=0);
				$rootScope.cache.tagCount[tid]++;
			}
			if(tag.name){
				tag.name='';
				$rootScope.$apply();
			}
			return Promise.resolve(result);
		}())
	}
	var del=function(id,index){
		var del=angular.copy(result[id].splice(index,1).pop());
		crud.del('WebRelation',del)
		
		$rootScope.cache.tagCount[del.tid]--;
		return Promise.resolve(result);
	}
	
	return {
		add:add,
		del:del,
		get:get,
	}
}])
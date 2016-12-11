angular.module('app').factory('idSearch',
["$rootScope","crud","tagName",function($rootScope,crud,tagName){
	var result={};
	var get=function(ids,callback){
		getCount();
		return promiseRecursive(function* (ids){
			for(var i in result){
				delete result[i];
			}
			var wid=$rootScope.cache.webList.select;
			var where_list=[
				{field:'wid',type:0,value:wid},
			];
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
	var getInter=function(require,option,mode){
		getCount(require);
		return promiseRecursive(function* (require,option,mode){
			var arg={};
			arg.where_list=[];
			
			if($rootScope.cache.webList && $rootScope.cache.webList.select){
				arg.where_list.push({field:'wid',type:0,value:$rootScope.cache.webList.select});
			}else{
				yield Promise.reject("沒有選網站");
			}
			
			if([2,3].indexOf(mode)==-1){
				for(var i in require){
					arg.where_list.push({field:'tid',type:0,value:require[i]})
				}
				for(var i in option){
					arg.where_list.push({field:'tid',type:0,value:option[i]})
				}
				
				if(!arg.where_list.length){
					yield Promise.reject("沒有搜尋條件");
				}
				
				var count=0;
				var value=[]
				if(require.length){
					count=require.length;
					value=value.concat(require)
				}else{
					if(option.length){
						count=1;
					}
				}
				arg.have_list=[
					{field:'tid',type:0,count:count,value:value},
				];
			}
			
			arg.group_list=["source_id"];
			
			var res=yield crud.get("WebRelation",arg);
			
			if(res.status){
				var ids=res.list.map(function(val){
					return val.source_id
				})
				return Promise.resolve(ids);
			}else{
				yield Promise.reject("沒有資料");
			}
		}.bind(this,require,option,mode)());
	}
	var getCount=function(require){
		return promiseRecursive(function* (require){
			var where_list=[];
			if($rootScope.cache.webList && $rootScope.cache.webList.select){
				where_list.push({field:'wid',type:0,value:$rootScope.cache.webList.select});
			}else{
				yield Promise.reject("沒有選網站");
			}
			var count=0;
			var value=[];
			for(var i in require){
				where_list.push({field:'tid',type:0,value:require[i]})
				count++;
				value.push(require[i])
			}
			
			var select_list=["tid"];
		
			var have_list=[
				{field:'tid',type:0,count:count,value:value},
			];
			
			var res=yield crud.get("WebRelation",{
				select_list:select_list,
				count_select_list:select_list,
				group_list:select_list,
				
				where_list:where_list,
				have_list:have_list,
			})
			$rootScope.cache.tagCount[tid]={};
			if(res.status){
				for(var i in res.list){
					var data=res.list[i];
					var tid=data.tid;
					var count=data["count(tid)"];
					$rootScope.cache.tagCount[tid]=count
				}
				$rootScope.$apply();
			}
		}.bind(this,require)())
		.catch(function(message){
			console.log(message);
		})
	}
	return {
		add:add,
		del:del,
		get:get,
		getInter:getInter,
	}
}])
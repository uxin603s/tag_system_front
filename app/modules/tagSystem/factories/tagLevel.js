angular.module('tagSystem')
.factory('tagLevel',["$rootScope","tagSystem","$timeout","tagType",
function($rootScope,tagSystem,$timeout,tagType){
	var data={
		tagTypeLevel:{},
		selects:{},
		TagLevelRelation:{},
	}
	
	var getTagLevel=function(tids){
		var where_list=[]
		for(var i in tids){
			var tid=tids[i];
			if(!data.tagTypeLevel[tid]){
				data.tagTypeLevel[tid]=[];
				data.selects[tid]=[];
				where_list.push({field:'tid',type:0,value:tid})
			}
		}
		if(!where_list.length){
			return;
		}
		var post_data={
			func_name:"TagLevel::getList",
			arg:{
				where_list:where_list,
			}
		}
		tagSystem.post(post_data,function(res){
			// console.log(res)
			if(res.status){
				var list=res.list.sort(function(a,b){
					return a.sort_id-b.sort_id;
				})
				
				for(var i in list){					
					var item=list[i];
					// console.log(item)
					var tid=item.tid;
					var id=item.id;
					
					data.tagTypeLevel[tid].push(id)
				}
			}
			// callback && callback(tids)
		});
	
	}
	
	$rootScope.$watch(function(){return tagType.data.select_arr},function(tids){
		// console.log(tids)
		getTagLevel(tids);
	},1)
	
	$rootScope.$watch(function(){return data.tagTypeLevel},function(tagTypeLevel){
		
		var level_ids=[];
		for(var tid in tagTypeLevel){
			level_ids=level_ids.concat(tagTypeLevel[tid]);
		}
		// console.log(level_ids)
		if(level_ids.length)
			getTagRelation(level_ids);
		
	},1);	
	var getTagRelation=function(level_ids){
		
		var where_list=[]
		for(var i in level_ids){
			var level_id=level_ids[i];
			if(!data.TagLevelRelation[level_id]){
				data.TagLevelRelation[level_id]={};
				where_list.push({field:'level_id',type:0,value:level_id});
			}
		}
		// console.log(where_list.length)
		if(!where_list.length){
			return;
		}
		var post_data={
			func_name:"TagRelation::getList",
			arg:{
				where_list:where_list,
				order_list:[
					{field:'id',type:0},
					{field:'sort_id',type:0},
				],
				limit:{page:0,count:500},
			}
		}
		tagSystem.post(post_data,function(res){
			// console.log(res)
			if(res.status){
				// res.list.map(function(val){console.log(val.sort_id)})
				var tids=[];
				for(var i in res.list){
					var item=res.list[i];
					var id=item.id;
					var child_id=item.child_id;
					var level_id=item.level_id;
					
					
					if(!data.TagLevelRelation[level_id][id]){
						data.TagLevelRelation[level_id][id]=[];
					}
					
					
					data.TagLevelRelation[level_id][id].push(child_id)
					tids.push(child_id)
				}
				tagSystem.getTagName(tids);
				
				
				
				for(var i in level_ids){
					// console.log(level_ids[i])
					auto_select(level_ids[i])
				}
			}
		});		
	}
	var auto_select=function(level_id){
		for(var tid in data.tagTypeLevel){
			var level_ids=data.tagTypeLevel[tid];
			if(level_ids[0]==level_id){
				var list,select;
				for(var i in level_ids){
					var level_id=level_ids[i];
					if(i==0){
						select=0;
					}else{
						if(list){
							select=list[0];
						}else{
							continue;
						}
					}
					data.selects[tid][i]=select;
						list=data.TagLevelRelation[level_id][select];
				}
				if(list && list[0]){
					data.selects[tid][i*1+1]=list[0];
				}
				break;
			}
		}
		
	}
	return {
		data:data,
	}
	
	
	
	
	
}]);
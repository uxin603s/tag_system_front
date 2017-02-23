angular.module('tagSystem')
.factory('tagRelation',["$rootScope","tagSystem","$timeout","tagType","tagLevel",
function($rootScope,tagSystem,$timeout,tagType,tagLevel){
	var data={
		TagLevelRelation:{},
	}
	var sort_update=function(level_id,id,nv,ov){
		
		if(nv.length==ov.length){
			for(var i in nv){
				if(nv[i]!=ov[i]){
					var post_data={
						func_name:"TagRelation::update",
						arg:{
							update:{
								sort_id:i
							},
							where:{
								level_id:level_id,
								id:id,
								child_id:nv[i],
							},
						}
					}
					tagSystem.post(post_data,function(res){
						console.log(res)
					})
				}
			}
		}
	}
	
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
					{field:'sort_id',type:0},
				]
			}
		}
		tagSystem.post(post_data,function(res){
			
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
				for(var level_id in data.TagLevelRelation){
					for(var id in data.TagLevelRelation[level_id]){
						$rootScope.$watch(function(level_id,id){
							return data.TagLevelRelation[level_id][id];
						}.bind(this,level_id,id),
						sort_update.bind(this,level_id,id)
						,1)
					}
					auto_select(level_id)
					// 
				}
				
				
			}
		});		
	}
	$rootScope.$watch(function(){return tagLevel.data.tagTypeLevel},function(tagTypeLevel){
		var level_ids=[];
		for(var tid in tagTypeLevel){
			level_ids=level_ids.concat(tagTypeLevel[tid]);
		}
		// console.log()
		if(level_ids.length)
			getTagRelation(level_ids);
		
	},1);		
	var auto_select=function(level_id){
		for(var tid in tagLevel.data.tagTypeLevel){
			var level_ids=tagLevel.data.tagTypeLevel[tid];
			if(level_ids[0]==level_id){
				// console.log("lv1往下爬")
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
					tagLevel.data.selects[tid][i]=select;
					list=data.TagLevelRelation[level_id][select];
				}
				if(list && list[0]){
					tagLevel.data.selects[tid][i*1+1]=list[0];
				}
				break;
			}else{
				// console.log("不是stop");
			}
		}
		// var level_ids=tagLevel.data.tagTypeLevel[tid];
		
	}
	
	
	var array_diff=function(a,b){
		for(var i in a){
			var result=a[i];
			if(b.indexOf(result)==-1){
				return result;
			}
		}
	}
	var bind_watch=function(tid){
		watch[tid]=$rootScope.$watch(function(tid){
			return tagLevel.data.selects[tid]
		}.bind(this,tid),
		function(tid,selects,old_select){
			// console.log(tid,selects,old_select)
			var level_ids=tagLevel.data.tagTypeLevel[tid];
			if(selects.length==old_select.length){
				for(var index in selects){
					if(selects[index]!=old_select[index]){
						var select=selects[index];
						if(selects[index*1+1]){
							var level_id=level_ids[index];
							
							var list=data.TagLevelRelation[level_id][select];
							if(list && list[0]){
								selects[index*1+1]=list[0]
							}else{
								selects[index*1+1]=null;
							}
						}
					}
				}
			}
		}.bind(this,tid),1)
	}
	var watch={};
	
	$rootScope.$watch(function(){return tagType.data.select_arr},function(tids,old_tids){
		// console.log(tids)
		var cut=tids.length-old_tids.length;
		if(cut>0){//新增
			var tid=array_diff(tids,old_tids);
			bind_watch(tid)
			// console.log("add_watch",tid);
		}else if(cut<0){//刪除
			var tid=array_diff(old_tids,tids);
			watch[tid] && watch[tid]();
			// console.log("delete_watch",tid);
		}else{
			for(var i in tids){
				var tid=tids[i];
				if(!watch[tid]){
					bind_watch(tid)
				}
			}
			
			// console.log("no_watch equal");
		}
		
	},1)
	

	
	
	return {
		data:data,
	}
}]);
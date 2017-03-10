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
				// for(var tid in data.tagTypeLevel){
					// auto_select(data.tagTypeLevel[tid][0])
				// }
			}
			// callback && callback(tids)
		});
	
	}
	
	$rootScope.$watch(function(){return tagType.data.select_arr},function(tids){
		getTagLevel(tids);
	},1)
	
	var getTagRelation=function(level_id,id,limit,where_list,callback){		
		
		if(!data.TagLevelRelation[level_id]){
			data.TagLevelRelation[level_id]={};
		}
		if(!data.TagLevelRelation[level_id][id]){
			data.TagLevelRelation[level_id][id]=[];
		}
		
		if(data.TagLevelRelation[level_id][id].length){
			callback && callback(data.TagLevelRelation[level_id][id])
			return
		}
		where_list.push({field:'id',type:0,value:id});
		where_list.push({field:'level_id',type:0,value:level_id});
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
				limit:limit,
			}
		}
		console.log(where_list)
		tagSystem.post(post_data,function(res){
			console.log(res)
			if(res.status){
				var tids=res.list.map(function(val){return val.child_id});
				
				limit.total_count=res.total_count
				limit.total_page=res.total_page
				
				data.TagLevelRelation[level_id][id]=tids;
				callback && callback(tids)
				tagSystem.getTagName(tids);
			}else{
				limit.total_count=0;
				limit.total_page=0;
				
			}
		});		
	}
	
	return {
		data:data,
		getTagRelation:getTagRelation,
	}
}]);
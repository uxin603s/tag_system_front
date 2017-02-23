angular.module('tagSystem')
.factory('tagLevel',["$rootScope","tagSystem","$timeout","tagType",
function($rootScope,tagSystem,$timeout,tagType){
	var data={
		tagTypeLevel:{},
		selects:{},
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
		getTagLevel(tids);
	},1)
	
	
	return {
		data:data,
	}
}])
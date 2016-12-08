angular.module('app').factory('tagName',
['cache','$rootScope',
function(cache,$rootScope){
	cache.tagName || (cache.tagName={});
	cache.tagNameR || (cache.tagNameR={});
	var insert=function(name,callback){
		if(name===""){
			alert("標籤不能空白")
			return;
		}
		var post_data={
			func_name:'TagName::insert',
			arg:{
				name:name,
			},
		}
		
		$.post("ajax.php",post_data,function(res){
			callback && callback(res)
		},"json")
	};
	var cacheTagName=function(list){
		for(var i in list){
			var data=list[i];
			var id=data.id;
			var name=data.name;
			cache.tagName[id]=name;
			cache.tagNameR[name]=id;
		}
	}
	var getList=function(where_list,return_type){
		return new Promise(function(resolve,reject) {
			var post_data={
				func_name:'TagName::getList',
				arg:{
					where_list:where_list,
				},
			}
			
			$.post("ajax.php",post_data,function(res){
				var result_names=[];
				// console.log(res.list)
				if(res.status){
					var list=res.list;
					for(var i in list){
						var data=list[i];
						result_names.push(data.name);
					}
				}else{
					var list=[];
				}	
				
				if(return_type){//搜尋模式
					cacheTagName(list)
					resolve && resolve(list)
				}else{//新增模式
					var insert_arr=[];
					if(where_list.length==list.length){
						cacheTagName(list)
						resolve && resolve(list)
					}else{
						for(var i in where_list){
							if(result_names.indexOf(where_list[i].value)==-1){
								insert_arr.push(where_list[i].value)
							}
						}
						for(var i in insert_arr){
							insert(insert_arr[i],function(res){
								if(res.status){
									list.push(res.insert)
									if(where_list.length==list.length){
										cacheTagName(list)
										resolve && resolve(list)
									}
								}
							})
						}
					}
				}
			},"json")	
		})
	}
	var nameToId=function(name,return_type){
		var where_list=[];
		
		if(typeof name =="string"){
			where_list.push({field:'name',type:2,value:name})
		}else{
			for(var i in name){
				where_list.push({field:'name',type:2,value:name[i]})
			}
		}
		
		return getList(where_list,return_type)
		.then(function(list){
			
			$rootScope.$apply();
			return Promise.resolve(list);
		})
	}
	
	var idToName=function(ids){
		return new Promise(function(resolve,reject) {
			var where_list=[];
			var result=[];
			for(var i in ids){
				if(cache.tagName[ids[i]]){
					result.push(cache.tagName[ids[i]])
				}else{
					where_list.push({field:'id',type:0,value:ids[i]});
				}
			}
			
			if(!where_list.length){
				return resolve(result)
			}
			
			return getList(where_list,1)
			.then(function(list){
				$rootScope.$apply();
				return resolve(result);
			})
			
		})
	}
	return {
		insert:insert,
		getList:getList,
		nameToId:nameToId,
		idToName:idToName,
	}
}])
angular.module('tagSystem')
.factory('tagType',["$rootScope","tagSystem","$timeout",function($rootScope,tagSystem,$timeout){
	var data={
		select_arr:[],
		not_select_arr:[],
		primary_data:{},
	}
	var getWebTagType=function(){
		return new Promise(function(resolve,reject){
			var post_data={
				func_name:"WebTagType::getList",
				arg:{
					where_list:[
						{field:'wid',type:0,value:tagSystem.data.wid},
					],
					order_list:[
						{field:'sort_id',type:0},
					],
				}
			}
			tagSystem.post(post_data,function(res){
				if(res.status){
					data.select_arr=res.list.map(function(val){
						return val.tid;
					})
				}
				resolve();
			});
		})	
	}
	
	var getTagType=function(){
		return new Promise(function(resolve,reject){
			var where_list=[];
			
			var post_data={
				func_name:"TagType::getList",
				arg:{
					where_list:where_list,
				}
			}
			tagSystem.post(post_data,function(res){
				if(res.status){
					// data.primary_data={};
					for(var i in res.list){
						var item=res.list[i];
						var id=item.id;
						// console.log(data)
						data.primary_data[id]=item
					}
				}
				resolve();
			});
		})	
	}
	var timer;
	var process=function(){
		$timeout.cancel(timer)
		timer=$timeout(function(){
			data.not_select_arr=[];
			for(var id in data.primary_data){
				id*=1
				var index=data.select_arr.indexOf(id);
				if(index==-1){
					data.not_select_arr.push(id)
				}
			}
		},0)
	}
	
	getTagType()
	.then(function(){
		return getWebTagType();
	})
	.then(function(){
		$rootScope.$watch(function(){return data.primary_data},process,1)
		$rootScope.$watch(function(){return data.select_arr},process,1)
		$rootScope.$watch(function(){return data.select_arr},function(nv,ov){
			if(nv.length==ov.length){
				for(var i in nv){
					if(nv[i]!=ov[i]){
						var post_data={
							func_name:"WebTagType::update",
							arg:{
								where:{wid:tagSystem.data.wid,tid:nv[i]},
								update:{sort_id:i},
							}
						}
						tagSystem.post(post_data,function(res){
							console.log(res)
						});
					}
				}
			}
		},1)
	})
	
	
	return {
		data:data,
	}
}]);
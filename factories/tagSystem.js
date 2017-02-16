angular.module('tagSystem')
.factory('tagSystem',['$rootScope',function($rootScope){
	var data={
		tagName:{},
		control:{
			mode:0
		},
		
		tagRelation:{},
		selects:[],
	}
	var iframe=document.createElement("iframe");
	iframe.style="width:100%;height:100%;"
	iframe.setAttribute("marginwidth",0);
	iframe.setAttribute("marginheight",0);
	iframe.setAttribute("scrolling","no");
	iframe.setAttribute("frameborder",0);
	iframe.setAttribute("style","display:none;");
	var source;
	var timer={};
	var post_id="post"+(Date.now()+Math.floor(Math.random()*999));
	$rootScope[post_id]={}
	var init=function(src){
		var load=function(){
			source=iframe.contentWindow;
			postMessageHelper.init("tagSystem",source)
			postMessageHelper.send("tagSystem")
			postMessageHelper.receive("tagSystem",function(res){
				if(res.name=="post"){
					$rootScope[post_id][res.value.id]=res.value.value;
				}
				$rootScope.$apply();
			})
		}
		iframe.onload=load
		iframe.src=src;
	}
	var post=function(request,callback){
		var id="rand"+Date.now()+Math.floor(Math.random()*9999);
		postMessageHelper
			.send("tagSystem",{name:'post',value:{request:request,id:id}})
		var watch=$rootScope.$watch(post_id+"."+id,function(res){
			if(res){
				callback && callback(res);
				watch();
			}
		},1);
		
	}
	var getTagName=function(tids){
		var where_list=[];
		for(var i in tids){
			if(!data.tagName[tids[i]])
			where_list.push({field:'id',type:0,value:tids[i]})
		}
		var post_data={
			func_name:"TagName::getList",
			arg:{
				where_list:where_list
			}
		}
		post(post_data,function(res){
			if(res.status){
				for(var i in res.list){
					var id=res.list[i].id;
					var name=res.list[i].name;
					data.tagName[id]=name;
				}
			}
		})
	}
	
	
	var addTag=function(list,tid,id){
		if(list.indexOf(tid)!=-1)return
		list.push(tid);
		var wid=data.wid;
		var post_data={
			func_name:"WebRelation::insert",
			arg:{
				source_id:id,
				wid:wid,
				tid:tid,
				sort_id:list.length,
			}
		}
		post(post_data,function(res){
			console.log(res)
			if(!res.status){
				// var index=list.indexOf(tid);
				// if(index!=-1){
					// list.splice(index,1);
				// }
			}
		});
	}
	var delTag=function(list,index,id){
		if(!confirm("確認刪除?"))return;
		var tid=list.splice(index,1).pop();
		var wid=data.wid;
		var post_data={
			func_name:"WebRelation::delete",
			arg:{
				source_id:id,
				wid:wid,
				tid:tid,
			}
		}
		// console.log(post_data.arg)
		post(post_data,function(res){
			console.log(res)
			if(!res.status){
				list.splice(index,0,tid);
			}
		});
	}
	var searchTag=function(search,callback){	
		data.control.search.data=search;
		data.control.search.callback=callback;			
		data.control.mode=2
	}
	return {
		init:init,
		iframe:iframe,
		post:post,
		data:data,
		getTagName:getTagName,
		delTag:delTag,
		addTag:addTag,
		searchTag:searchTag,
	}
}])
angular.module('tagSystem',[])
.factory('tagSystem',['$rootScope',function($rootScope){
	var data={
		size:{
			w:0,
			h:0,
		},
		idList:[],
		tagList:{},
	}
	var iframe=document.createElement("iframe");
	iframe.style="width:100%;height:100%;"
	iframe.setAttribute("marginwidth",0);
	iframe.setAttribute("marginheight",0);
	iframe.setAttribute("scrolling","no");
	iframe.setAttribute("frameborder",0);
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
				clearTimeout(timer[res.name])
				timer[res.name]=setTimeout(function(){
					if(res.name=="resize"){
						data.size.w=res.value.w
						data.size.h=res.value.h
					}
					if(res.name=="idSearchTag"){
						data.tagList=res.value;
					}
					if(res.name=="getInsertList"){
						data.insertList=res.value
					}
					if(res.name=="tagSearchId"){
						data.idList=res.value
					}
					if(res.name=="searchTagName"){
						data.customInsertList=res.value;
					}
					if(res.name=="post"){
						$rootScope[post_id][res.value.id]=res.value.value;
					}
					$rootScope.$apply();
				},0)
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
	var tagSearchId=function(value){//使用tag搜尋source_id
		postMessageHelper
			.send("tagSystem",{name:'tagSearchId',value:value})
	}
	
	var idSearchTag=function(value){//搜尋source_id的tag
		postMessageHelper
			.send("tagSystem",{name:'idSearchTag',value:value})
		//使用後tagList回傳
	}
	var addIdRelation=function(id,tag){//建立source_id與tag關聯
		postMessageHelper
			.send("tagSystem",{name:'addIdRelation',value:{id:id,name:tag.name}})
		tag.name='';
		//使用後tagList回傳
	}
	var delIdRelation=function(id,index){//刪除source_id與tag關聯
		postMessageHelper
			.send("tagSystem",{name:'delIdRelation',value:{id:id,index:index}})
		//使用後tagList回傳
	}
	var chIdRelation=function(id,a,b){//改變source_id與tag順序
		postMessageHelper
			.send("tagSystem",{name:'chIdRelation',value:{id:id,a:a,b:b}})
	}
	var searchTagName=function(tag){
		postMessageHelper
			.send("tagSystem",{name:'searchTagName',value:tag.name})
		tag.name='';
	}
	
	var setMode=function(mode){
		postMessageHelper
			.send("tagSystem",{name:'setMode',value:mode})
	}
	
	return {
		post:post,
		init:init,
		iframe:iframe,
		data:data,
		tagSearchId:tagSearchId,
		idSearchTag:idSearchTag,
		addIdRelation:addIdRelation,
		delIdRelation:delIdRelation,
		chIdRelation:chIdRelation,
		searchTagName:searchTagName,
		setMode:setMode,
	}
}])
.component("tagSystem",{
bindings:{
	wid:"=",
	accessToken:"=",
},
templateUrl:'app/module/tagSystem/tagSystem.html?t='+Date.now(),
controller:["$scope","tagSystem","$rootScope",function($scope,tagSystem,$rootScope){
	$scope.$ctrl.$onInit=function(){
		
		var url="http://tag.cfd888.info/?";
		if($scope.$ctrl.wid){
			var wid=$scope.$ctrl.wid;
			url+="wid="+wid
			if($scope.$ctrl.accessToken){
				var access_token=$scope.$ctrl.accessToken;
				url+="&access_token="+access_token;
			}
			url+="&t="+Date.now()
			tagSystem.init(url);
			$("tag-system>div").append(tagSystem.iframe);
			$scope.tagSystem=tagSystem.data;
		}
		
	}
}],
})

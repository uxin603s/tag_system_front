angular.module('tagSystem',[])
.component("tagSystem",{
bindings:{
	url:"=",
	accessToken:"=",
	wid:"=",
},
templateUrl:'app/modules/tagSystem/tagSystem.html?t='+Date.now(),
controller:["$scope","tagSystem",function($scope,tagSystem){
	$scope.$ctrl.$onInit=function(){
		$scope.$watch("$ctrl.wid",function(wid){
			tagSystem.data.wid=wid;	
			// tagSystem.data.control.search.data.result=[];
			
		},1)
		
		$scope.tagSystem=tagSystem.data;
		$scope.control=tagSystem.data.control;
		var match=location.search.match(/\?([\d\D]+)/)
		var list=RegExp.$1.split("&");
		var result={};
		for(var i in list){
			var tmp=list[i].split("=");
			result[tmp[0]]=tmp[1];
		}	
		if(result.search){
			tagSystem.searchTid(result.search,function(tid){
				tagSystem.addSearchTid(tid,1)
			})
		}
		
		
		var url=$scope.$ctrl.url
		if($scope.$ctrl.accessToken){
			var access_token=$scope.$ctrl.accessToken;
			url+="?access_token="+access_token;
		}
		tagSystem.init(url);
		$("tag-system>div").append(tagSystem.iframe);
		tagSystem.data.wid=$scope.$ctrl.wid;	
	}
	$scope.getTag=function(tid){
		if($scope.control.mode==1){
			var list=$scope.control.edit.list;
			var source_id=$scope.control.edit.id;
		
			var add={
				tid:tid,
				source_id:source_id,
			}
			tagSystem.addTag(add,list);
		}else if([2,3].indexOf($scope.control.mode)){
			var index=$scope.control.search.data.optional.indexOf(tid)
			var index1=$scope.control.search.data.tmp.indexOf(tid)
			var index2=$scope.control.search.data.required.indexOf(tid)
			if(index==-1 && index1==-1 && index2==-1){
				$scope.control.search.data.optional.push(tid);
			}
		}
	}
}],
})
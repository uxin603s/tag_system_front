angular.module('tagSystem',[])
.component("tagSystem",{
bindings:{
	accessToken:"=",
	wid:"=",
},
templateUrl:'app/modules/tagSystem/tagSystem.html?t='+Date.now(),
controller:["$scope","tagSystem",function($scope,tagSystem){
	$scope.$ctrl.$onInit=function(){
		$scope.control=tagSystem.data.control;
		$scope.tagName=tagSystem.data.tagName;
		
		$scope.selects=tagSystem.data.selects;
		
		
		$scope.delTag=tagSystem.delTag;
		$scope.addTag=tagSystem.addTag;
		
		
		$scope.control.edit={}
		$scope.control.search={}
		var watch_selects
		$scope.$watch("control.mode",function(mode){
			if(mode==1){
				watch_selects=$scope.$watch("selects",function(selects){
					if(!selects.length)return;
					var tid=selects.pop();
					var list=$scope.control.edit.list;
					var source_id=$scope.control.edit.id;
				
					var add={
						tid:tid,
						source_id:source_id,
					}
					tagSystem.addTag(add,list);
				},1);
			}else if(mode==2){
				watch_selects=$scope.$watch("selects",function(selects){
					if(!selects.length)return;
					var tid=selects.pop();
					var index=$scope.control.search.data.optional.indexOf(tid)
					var index1=$scope.control.search.data.tmp.indexOf(tid)
					var index2=$scope.control.search.data.required.indexOf(tid)
					if(index==-1 && index1==-1 && index2==-1){
						$scope.control.search.data.optional.push(tid);
					}
				},1);
			}else{
				watch_selects && watch_selects();
			}
		},1)
		
		// console.log($scope.tagSystem)
		
		// var url="http://tag.cfd888.info/api.php";
		var url="http://192.168.1.2/tag_system_front/api.php";
		if($scope.$ctrl.accessToken){
			var access_token=$scope.$ctrl.accessToken;
			url+="?access_token="+access_token;
		}
		tagSystem.init(url);
		$("tag-system>div").append(tagSystem.iframe);
		tagSystem.data.wid=$scope.$ctrl.wid;	
	}
}],
})




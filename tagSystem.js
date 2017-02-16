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
		$scope.del=tagSystem.delTag;
		$scope.selects=tagSystem.data.selects;
		
		tagSystem.data.control.edit={}
		tagSystem.data.control.search={}
		
		var watch_selects
		$scope.$watch("control.mode",function(mode){
			if(mode==1){
				watch_selects=$scope.$watch("selects",function(selects){
					if(!selects.length)return;
					var tid=selects.pop();
					tagSystem.addTag(tagSystem.data.control.edit.list,tid,tagSystem.data.control.edit.id)
				},1);
			}else if(mode==2){
				watch_selects=$scope.$watch("selects",function(selects){
					if(!selects.length)return;
					var tid=selects.pop();
					var index=tagSystem.data.control.search.data.optional.indexOf(tid)
					if(index==-1){
						tagSystem.data.control.search.data.optional.push(tid);
					}
				},1);
			}else{
				watch_selects && watch_selects();
			}
		},1)
		$scope.$watch("control.search.data",function(data){
			console.log(data)
		},1)
		// $scope
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




angular.module('app').component("index",{
bindings:{},
templateUrl:'app/components/index/index.html?t='+Date.now(),
controller:['$scope','cache',
function($scope,cache){
	$scope.cache=cache;
	$scope.$watch("cache.not_finish_flag",function(not_finish_flag){
		if(not_finish_flag)return;
		postMessageHelper.receive('tagSystem',function(res){
			if(res.name=='setMode'){
				cache.mode=res.value
			}
			if(res.name=="tagSearchId"){
				cache.absoluteSearch=[];
				for(var i in res.value){
					cache.absoluteSearch.push({name:res.value[i]});
				}
			}
			$scope.$apply();
		})
		
		
		$scope.document=document.documentElement;
		window.onresize=function(){
			if(cache.width==$scope.document.scrollWidth)
			if(cache.height==$scope.document.scrollHeight)
			return;	
			
			
			clearTimeout($scope.resizeTimer)
			$scope.resizeTimer=setTimeout(function(){
				var w=$scope.document.scrollWidth;
				var h=$scope.document.scrollHeight;
				postMessageHelper.send('tagSystem',{
					name:'resize',
					value:{
						w:w,
						h:h,
					},
				})
				$scope.$apply();
			},50)
		}
		
		$scope.$watch("document.scrollWidth",window.onresize);
		$scope.$watch("document.scrollHeight",window.onresize);
		$scope.$watch("cache.relation",window.onresize,1);
	})
}],
})


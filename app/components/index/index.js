angular.module('app').component("index",{
bindings:{},
templateUrl:'app/components/index/index.html?t='+Date.now(),
controller:['$scope','cache',
function($scope,cache){
	$scope.cache=cache;
	$scope.$watch("cache.not_finish_flag",function(not_finish_flag){
		if(not_finish_flag)return;
		// postMessageHelper.receive('tagSystem.size',function(res){})
		
		$scope.document=document;
		var w,h
		window.onresize=function(){
			if(w==$scope.document.documentElement.scrollWidth)
			if(h==$scope.document.documentElement.scrollHeight)
				return ;
			w=$scope.document.documentElement.scrollWidth;
			h=$scope.document.documentElement.scrollHeight;
			clearTimeout($scope.resizeTimer)
			$scope.resizeTimer=setTimeout(function(){
				postMessageHelper.send('tagSystem',{
					name:'resize',
					value:{
						w:w,
						h:h,
					},
				})
				$scope.$apply();
			},0)
		}
		$scope.$watch("document.documentElement.scrollWidth",window.onresize);
		$scope.$watch("document.documentElement.scrollHeight",window.onresize);
	})
}],
})


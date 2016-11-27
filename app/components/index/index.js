angular.module('app').component("index",{
	bindings:{},
	templateUrl:'app/components/index/index.html?t='+Date.now(),
	controller:['$scope','cache',
	function($scope,cache){
		$scope.cache=cache;
		return
		
	
		$scope.$watch("cache.tag_search.result",function(value){
			if(!value)return;
			postMessageHelper.send('tagSystem',{name:'search',value:value})
		})
		$scope.document=document.documentElement;
		window.onresize=function(){
			clearTimeout($scope.resizeTimer)
			$scope.resizeTimer=setTimeout(function(){
				cache.width=$scope.document.scrollWidth;
				cache.height=$scope.document.scrollHeight;
				// console.log(cache.width,cache.height)
				postMessageHelper.send('tagSystem',{
					name:'resize',
					value:{
						w:cache.width,
						h:cache.height,
					},
				})
				$scope.$apply();
			},0)
		}
		
		$scope.$watch("document.scrollWidth",window.onresize);
		$scope.$watch("document.scrollHeight",window.onresize);
		$scope.$watch("cache.editMode",window.onresize);
	}],
})


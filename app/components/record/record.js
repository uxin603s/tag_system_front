angular.module('app').component("record",{
	bindings:{
		data:"=",
		callback:"=",
		count:"=",
		cache:"=",
		switch:"=",
	},
	templateUrl:'app/components/record/record.html?t='+Date.now(),
	controller:['$scope','$timeout','$element',function($scope,$timeout,$element){
		$scope.$ctrl.$onInit=function(){
			if($scope.$ctrl.cache.record){
				$scope.record=$scope.$ctrl.cache.record;
			}else{
				$scope.record=[];
			}
			if($scope.$ctrl.cache.record_pointer){
				$scope.record_pointer=$scope.$ctrl.cache.record_pointer;
			}else{
				$scope.record_pointer=0;
			}
			var selfcall;
			var set_scroll=function(record_pointer){
				if($($element).find(".record_item").eq(record_pointer).length){
					var item=$($($element).find(".record_item")[record_pointer])
					var x=item.position().left;
					var w=item.width();
					var scroll_x=$($element).find(".record").scrollLeft();
					var result=x+scroll_x-w*5;
					console.log(x,scroll_x,w,result)
					$($element).find(".record").scrollLeft(result)
				}else{
					
					$timeout.cancel(selfcall);
					selfcall=$timeout(function(){
						set_scroll(record_pointer)
					},50)
				}
			}
			$scope.$watch("record_pointer",function(record_pointer){
				$scope.$ctrl.cache.record_pointer=record_pointer;
				set_scroll(record_pointer);
				
			},1)
			
			
			if($scope.record.length){
				$scope.stop_record=true;
				$scope.stop_record_timer=$timeout(function(){
					$scope.stop_record=false;
				},1000)
			}
			$scope.back_record=function(){
				var tmp=$scope.record[$scope.record_pointer];
				if(tmp){
					$scope.stop_record=true;
					$scope.$ctrl.data=angular.copy(tmp.data);
					$timeout.cancel($scope.stop_record_timer);
					$scope.stop_record_timer=$timeout(function(){
						$scope.stop_record=false;
					},1000)
				}else{
					$scope.record_pointer--;
					alert("無法再復原了")
				}
			}
			$scope.$watch("$ctrl.data",function(data){
				if($scope.stop_record)return;
				$timeout.cancel($scope.record_timer)
				$scope.record_timer=$timeout(function(){
					if($scope.$ctrl.callback){
						var data=$scope.$ctrl.callback();
						if(data){
							var data=angular.copy(data);
							$scope.record_pointer=0;
							var time_int=Date.now();
							$scope.record.unshift({time_int:time_int,data:data});							
							var count=10;
							if($scope.$ctrl.count){
								count=$scope.$ctrl.count;
							}
							if($scope.record.length>count){
								$scope.record.pop();
							}
						}
					} 
				},500)
			},1);
			$(document).keyup(function(e){
				if(e.keyCode==17){
					$scope.ctrl=false;
					$scope.$apply();
				}
			})
			$(document).keydown(function(e){
				if(e.keyCode==17){
					$scope.ctrl=true;
					$scope.$apply();
				}
				if($scope.ctrl && e.keyCode==90 && $scope.$ctrl.switch){
					$scope.record_pointer++
					$scope.back_record();
					$scope.$apply();
				}
			})
		}
	}],
})

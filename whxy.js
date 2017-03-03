angular.module('app').component("whxy",{
	bindings:{
		data:"=",
		scale:"=",
		hide:"=",	
	},
	transclude: true,
	templateUrl:'app/components/whxy/whxy.html?t='+Date.now(),
	controller:['$scope','$timeout',function($scope,$timeout){
		$scope.floor=window.Math.floor;
		$scope.pointer_list=[0,1,2,3,5,6,7,8];
		$scope.position_control_flag=34;
		$scope.fix_count=1;
		// $scope.$watch("data",function(data){
			// if(data.w>data.h){
				// $scope.position_control_flag=data.w/10;
			// }else{
				// $scope.position_control_flag=data.h/10;
			// }
		// },1)
		
		$scope.$watch("$ctrl.scale",function(scale){
			if(scale){
				$scope.lock_scale=$scope.$ctrl.data.w/$scope.$ctrl.data.h;
			}
		},1)
		var moveXY=function(x,y){
			$scope.$ctrl.data.x=Math.floor(x);
			$scope.$ctrl.data.y=Math.floor(y);
			$scope.$apply();
		}
		
		
		var moveWH=function(newX,newY){
			var pointer=$scope.dataWH.index;
			var pointer_x=Math.floor(pointer / 3);
			var pointer_y=(pointer % 3);
			var w=$scope.$ctrl.data.w;
			var h=$scope.$ctrl.data.h;
			var x=$scope.$ctrl.data.x;
			var y=$scope.$ctrl.data.y;
			
			
			
			if(pointer_x==0){
				w=$scope.$ctrl.data.w*1-newX;
				x=$scope.$ctrl.data.x*1+newX;
			}
			if(pointer_x==2){
				w=$scope.$ctrl.data.w*1+newX;
			}
			
			if(pointer_y==0){
				h=$scope.$ctrl.data.h*1-newY;
				y=$scope.$ctrl.data.y*1+newY;
			}
			if(pointer_y==2){
				h=$scope.$ctrl.data.h*1+newY;
			}
			
			if($scope.$ctrl.scale){
				console.log($scope.lock_scale)
				// console.log('pointer',pointer_x,pointer_y)
				if(pointer_x==1 || pointer_y==1){
					tmp_w=h*$scope.lock_scale;
					tmp_h=w/$scope.lock_scale;
					
					if([0,2].indexOf(pointer_y)!=-1){
						x-=(tmp_w-w)/2;
						w=tmp_w;
						console.log(1)
					}
					if([0,2].indexOf(pointer_x)!=-1){
						y-=(tmp_h-h)/2;
						h=tmp_h;
						console.log(2)
					}
					
					// console.log(w,h,newX,newY)
					// console.log(pointer_x,pointer_y)
					// return {w:w,h:h};
				}else{
					tmp_w=h/$scope.lock_scale;
					tmp_h=w/$scope.lock_scale;
					if(tmp_w>tmp_h){
						if(pointer_x==0){
							x-=tmp_w-w;
						}
						w=tmp_w;
					}else{
						if(pointer_y==0){
							y-=tmp_h-h;
						}
						h=tmp_h;
					}
				}
				
			}
			
			if(w>0){
				$scope.$ctrl.data.x=x;
				$scope.$ctrl.data.w=w;
			}
			if(h>0){
				$scope.$ctrl.data.h=h;
				$scope.$ctrl.data.y=y;
			}
			$scope.$apply();
			return {w:w,h:h}
		}
		$scope.selectXY=function(e){
			if($scope.dataXY){
				// console.log("endXY")
				delete $scope.dataXY;
				$(document).off("mousemove");
				return
			}else{
				if($scope.dataWH)return
				// console.log("startXY")
				$scope.dataXY={
					x:e.clientX,
					y:e.clientY,
				};

				$(document).on("mousemove",function(e){
					if(!$scope.dataXY)return
					var newX=(e.clientX-$scope.dataXY.x);
					var newY=(e.clientY-$scope.dataXY.y);
					var x=newX+$scope.$ctrl.data.x*1;
					var y=newY+$scope.$ctrl.data.y*1;
					moveXY(x,y);
					$scope.dataXY.x=e.clientX;
					$scope.dataXY.y=e.clientY;
					$scope.$apply();
				})
			}
		}
		
		$scope.selectWH=function(e,index){
			if($scope.dataWH){
				delete $scope.dataWH;
				$(document).off("mousemove");
				$(document).off("click");
			}else{
				// console.log("startWH")
				$scope.dataWH={
					x:e.clientX,
					y:e.clientY,
					index:index,
				};
				$(document).on("mousemove",function(e){
					if(!$scope.dataWH)return
					var cut_w=Math.floor(e.clientX-$scope.dataWH.x);	
					var cut_h=Math.floor(e.clientY-$scope.dataWH.y);
					// var fix_w=0;
					// var fix_h=0;
					
					
					var result=moveWH(cut_w,cut_h);
					// if(result.w>0){
						$scope.dataWH.x=e.clientX;
					// }
					// if(result.h>0){
						$scope.dataWH.y=e.clientY;
					// }
					$scope.$apply();
				})
				$timeout(function(){
					$(document).on("click",function(e){
						if($scope.dataWH){
							delete $scope.dataWH;
							$(document).off("mousemove");
							$(document).off("click");
							$scope.$apply()
						}
					});
				},0)
				
			}
		}
		
		$(document).on("keypress",function(e){
			$timeout.cancel($scope.timerWH)
			$scope.timerWH=$timeout(function(){
				$scope.fix_count=1;
			},50);
			
			$scope.fix_count*=1.05;
			var fix_count=Math.floor($scope.fix_count);
			if($scope.dataXY){
				switch(e.keyCode){
					case 97:
						moveXY($scope.$ctrl.data.x-fix_count,$scope.$ctrl.data.y)
						break;
					case 100:
						moveXY($scope.$ctrl.data.x+fix_count,$scope.$ctrl.data.y)
						break;
					case 119:
						moveXY($scope.$ctrl.data.x,$scope.$ctrl.data.y-fix_count)
						break;
					case 115:
						moveXY($scope.$ctrl.data.x,$scope.$ctrl.data.y+fix_count)
						break;
					case 13:
						delete $scope.dataXY;
						break;
				}
			}
			
			if($scope.dataWH){
				switch(e.keyCode){
					case 97:
						moveWH(-fix_count,0);
						break;
					case 100:
						moveWH(fix_count,0);
						break;
					case 119:
						moveWH(0,-fix_count);
						break;
					case 115:
						moveWH(0,fix_count);
						break;
					case 13:
						delete $scope.dataWH;
						break;
				}
			}
			
			
			$scope.$apply();
		});
		
		$scope.$watch("$ctrl.data",function(data){
			$timeout.cancel($scope.floor_timer);
			$scope.floor_timer=$timeout(function(data){
				// console.log(data)
				data.x=Math.round(data.x);
				data.y=Math.round(data.y);
				data.w=Math.round(data.w);
				data.h=Math.round(data.h);
			}.bind(this,data),500)
			
		},1)
	}],
})
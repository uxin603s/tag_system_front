angular.module('app').component("whxy",{
	bindings:{
		data:"=",
		scale:"=",
		lockScale:"=",	
		selected:"=",	
	},
	transclude: true,
	templateUrl:'app/components/whxy/whxy.html?t='+Date.now(),
	controller:['$scope','$timeout','$element',function($scope,$timeout,$element){
		$scope.floor=window.Math.floor;
		$scope.pointer_list=[0,1,2,3,5,6,7,8];
		$scope.position_control_flag=34;
		$scope.fix_count=1;
		
		var moveXY=function(x,y){
			$scope.$ctrl.data.x=(x);
			$scope.$ctrl.data.y=(y);
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
			
			if($scope.$ctrl.lockScale){
				if(pointer_x==1 || pointer_y==1){
					tmp_w=h*$scope.$ctrl.lockScale;
					tmp_h=w/$scope.$ctrl.lockScale;
					
					if([0,2].indexOf(pointer_y)!=-1){
						x-=(tmp_w-w)/2;
						w=tmp_w;
					}
					if([0,2].indexOf(pointer_x)!=-1){
						y-=(tmp_h-h)/2;
						h=tmp_h;
					}
				}else{
					tmp_w=h/$scope.$ctrl.lockScale;
					tmp_h=w/$scope.$ctrl.lockScale;
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
		
		var add_xy_handler=function(e){
			if(!$scope.dataXY)return
			
			var newX=(e.clientX-$scope.dataXY.x);
			var newY=(e.clientY-$scope.dataXY.y);
			
			if($scope.$ctrl.scale){
				newX/=$scope.$ctrl.scale;
				newY/=$scope.$ctrl.scale;
			}
			var x=newX+$scope.$ctrl.data.x*1;
			var y=newY+$scope.$ctrl.data.y*1;
			moveXY(x,y);
			$scope.dataXY.x=e.clientX;
			$scope.dataXY.y=e.clientY;
			$scope.$apply();
		}
		var del_xy_handler=function(e){
			if($scope.dataXY){
				delete $scope.dataXY;
				$(document).off("mousemove",add_xy_handler);
				$(document).off("click",del_xy_handler);
				if(e){
					$scope.$apply()
				}
			}
		}
		$scope.selectXY=function(e){
			if($scope.dataXY){
				del_xy_handler();
			}else{
				if($scope.dataWH)return
				$scope.dataXY={
					x:e.clientX,
					y:e.clientY,
				};

				$(document).on("mousemove",add_xy_handler);
				
				$timeout(function(){
					$(document).on("click",del_xy_handler);
				},0)
			}
		}
		var add_wh_handler=function(e){
			if(!$scope.dataWH)return
			var cut_w=(e.clientX-$scope.dataWH.x);	
			var cut_h=(e.clientY-$scope.dataWH.y);
			
			if($scope.$ctrl.scale){
				cut_w/=$scope.$ctrl.scale;
				cut_h/=$scope.$ctrl.scale;
			}
			var result=moveWH(cut_w,cut_h);
			$scope.dataWH.x=e.clientX;
			$scope.dataWH.y=e.clientY;
			$scope.$apply();
		}
		var del_wh_handler=function(e){
			if($scope.dataWH){
				delete $scope.dataWH;
				$(document).off("mousemove",add_wh_handler);
				$(document).off("click",del_wh_handler);
				if(e){
					$scope.$apply()
				}
			}
		}
		$scope.selectWH=function(e,index){
			if($scope.dataWH){
				del_wh_handler();
			}else{
				$scope.dataWH={
					x:e.clientX,
					y:e.clientY,
					index:index,
				};
				
				$(document).on("mousemove",add_wh_handler);
				
				$timeout(function(){
					$(document).on("click",del_wh_handler);
				},0)
			}
		}
		
		$(document).on("keypress",function(e){
			$timeout.cancel($scope.timerWH)
			$scope.timerWH=$timeout(function(){
				$scope.fix_count=1;
			},50);
			
			$scope.fix_count*=1.05;
			var fix_count=$scope.fix_count;
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
		var point_after=Math.pow(10,1);//取小數點後幾位
		$scope.$watch("$ctrl.data",function(data){
			$timeout.cancel($scope.floor_timer);
			$scope.floor_timer=$timeout(function(data){
				
				data.x=Math.round(data.x*point_after)/point_after;
				data.y=Math.round(data.y*point_after)/point_after;
				data.w=Math.round(data.w*point_after)/point_after;
				data.h=Math.round(data.h*point_after)/point_after;
			}.bind(this,data),500)
			
		},1)
	}],
})
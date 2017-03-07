angular.module('app').component("whxys",{
	bindings:{
		width:"=",
		height:"=",
		whxys:"=",
		cache:"=",
	},
	templateUrl:'app/components/whxy/whxys.html?t='+Date.now(),
	controller:['$scope','$timeout','$element',function($scope,$timeout,$element){
		$scope.$ctrl.$onInit=function(){
			$($element).mouseleave(function(){
				$scope.recordSwitch=false;
				$scope.$apply();
			})
			$($element).mouseenter(function(){
				$scope.recordSwitch=true;
				$scope.$apply();
			})
			if($scope.$ctrl.cache.hide){
				$scope.hide=$scope.$ctrl.cache.hide;
			}else{
				$scope.hide={};
			}
			
			if($scope.$ctrl.cache.lockScale){
				$scope.lockScale=$scope.$ctrl.cache.lockScale;
			}else{
				$scope.lockScale={};
			}
			
			
			$scope.select_whxy=$scope.$ctrl.cache.select_whxy;
			
			$scope.$watch("select_whxy",function(select_whxy){
				$scope.$ctrl.cache.select_whxy=select_whxy
			},1)
			
			
			
			$scope.$watch(function(){
				return $($element).children().width();
			},function(width){
				$scope.scale=width/$scope.$ctrl.width;
			},1);
			$scope.$watch("$ctrl.whxys",function(whxys){
				$scope.whxys=whxys.slice().reverse();
			},1);
		}
		
		$scope.swap=function(arr,index,swap_index){
			var tmp=arr[index];
			arr[index]=arr[swap_index];
			arr[swap_index]=tmp;
		}
		
		$scope.swap_whxys=function(type){
			var index=$scope.select_whxy;
			var swap_index=$scope.select_whxy+type;
			if($scope.$ctrl.whxys[swap_index]){
				$scope.swap($scope.$ctrl.whxys,index,swap_index);
				$scope.swap($scope.lockScale,index,swap_index);
				$scope.swap($scope.hide,index,swap_index);
				$scope.select_whxy=swap_index;
			}
		}
		
		
		
		$scope.backWH=function(index,type){
			var img=new Image;
			var item=$scope.$ctrl.whxys[index];
			img.onload=function(){
				if(type){
					var d=this.naturalWidth/this.naturalHeight;
					$scope.lockScale[index]=d
					if(item.w>item.h){
						item.h=Math.ceil(item.w/d);
					}else{
						item.h=Math.ceil(item.w/d);
					}
				}else{
					item.w=this.naturalWidth
					item.h=this.naturalHeight
				}
				$scope.$apply();
			}
			img.src=item.image_src
		}
		
		var point_after=Math.pow(10,1);//取小數點後幾位
		$scope.saveCallback=function(arr){
			var data=$scope.$ctrl.whxys;
			var check_field_arr=["x","y","w","h"];
			for(var i in check_field_arr){
				for(var j in data){
					var tmp=data[j][check_field_arr[i]]
					if(tmp!=Math.floor(tmp*point_after)/point_after){
						return false;
					}
				}
			}
			return data;	
		}
	}],
})
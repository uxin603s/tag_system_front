angular.module('app').directive('sortable',['$interval','$parse','$timeout',function($interval,$parse,$timeout){
	 return {		
		restrict: 'A',
		scope:{
			index:'=',
			sortable:'=',
			field:'@'
		},
        link:function($scope,$element,$attrs,$ngModel){
			$($element).on('dragstart',function(e){
				e.originalEvent.dataTransfer.setData('index',$scope.index)
			})
			$($element).on('dragover',function(e){
				e.preventDefault();
			})
			$($element).on('drop',function(e){
				e.preventDefault();
				var tmp_index=$scope.index;
				var swap_index=e.originalEvent.dataTransfer.getData('index');
				if($scope.field){
					var a=$scope.sortable[tmp_index][$scope.field];
					var b=$scope.sortable[swap_index][$scope.field];
					$scope.sortable[tmp_index][$scope.field]=b;
					$scope.sortable[swap_index][$scope.field]=a;
				}else{
					var a=$scope.sortable[tmp_index];
					var b=$scope.sortable[swap_index];
					$scope.sortable[tmp_index]=b;
					$scope.sortable[swap_index]=a;

				}
				$scope.$apply();
			})
		}
	 }
}])
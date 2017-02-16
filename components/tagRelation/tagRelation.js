angular.module('tagSystem').component("tagRelation",{
bindings:{
	selects:"=",
	index:"=",
	lid:"=",
},
templateUrl:'app/modules/tagSystem/components/tagRelation/tagRelation.html?t='+Date.now(),
controller:["$scope","tagSystem",function($scope,tagSystem){
	$scope.tagName=tagSystem.data.tagName;
	
	var getTagRelation=function(lid){
		return new Promise(function(resolve,reject){
			var where_list=[]
			where_list.push({field:'level_id',type:0,value:lid})
			var post_data={
				func_name:"TagRelation::getList",
				arg:{
					where_list:where_list,
				}
			}
			tagSystem.post(post_data,function(res){
				$scope.list={};
				if(res.status){
					var tid=[];
					for(var i in res.list){
						var data=res.list[i];
						var id=data.id;
						var child_id=data.child_id;
						if(!$scope.list[id]){
							$scope.list[id]=[];
						}
						$scope.list[id].push(child_id)
						tid.push(child_id)
					}
					resolve(tid)
					
					// resolve();
					// console.log($scope.list)
					if($scope.$ctrl.selects.length>$scope.$ctrl.index+1)
					if(!$scope.$ctrl.selects[$scope.$ctrl.index+1]){
						var select=$scope.$ctrl.selects[$scope.$ctrl.index];
						$scope.$ctrl.selects[$scope.$ctrl.index+1]=$scope.list[select][0];
					}
				}
				
			});
		})
		
	}
	
	$scope.$ctrl.$onInit=function(){
		// console.log($scope.$ctrl.index)
		getTagRelation($scope.$ctrl.lid)
		.then(function(tids){
			return tagSystem.getTagName(tids);
		})
	}
}],
})
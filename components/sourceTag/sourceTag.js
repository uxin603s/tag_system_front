angular.module('tagSystem').component("sourceTag",{
bindings:{
	id:"=",
	name:"=",
},
templateUrl:'app/modules/tagSystem/components/sourceTag/sourceTag.html?t='+Date.now(),
controller:["$scope","tagSystem",function($scope,tagSystem){
	$scope.tagName=tagSystem.data.tagName;
	
	var getWebRelation=function(id){
		return new Promise(function(resolve,reject){
			var where_list=[];
			where_list.push({field:'wid',type:0,value:tagSystem.data.wid})
			where_list.push({field:'source_id',type:0,value:id})
			var post_data={
				func_name:"WebRelation::getList",
				arg:{
					where_list:where_list,
				}
			}
			tagSystem.post(post_data,function(res){
				var tids=[];
				if(res.status){
					$scope.list=res.list.sort(function(a,b){
						return a.sort_id-b.sort_id;
					}).map(function(val){
						return val.tid;
					})
					resolve($scope.list);
					
				}else{
					$scope.list=[];
				}
				tagSystem.data.tagRelation[id]=$scope.list;
			});
		})
		
	}
	$scope.del=tagSystem.delTag;
	
	$scope.$ctrl.$onInit=function(){
		getWebRelation($scope.$ctrl.id)
		.then(function(tids){
			return tagSystem.getTagName(tids);
		})
	}
	$scope.editTag=function(id,name){
		tagSystem.data.control.edit.id=id;
		tagSystem.data.control.edit.name=name;
		tagSystem.data.control.edit.list=tagSystem.data.tagRelation[id];
		tagSystem.data.control.mode=1
	}
}],
})
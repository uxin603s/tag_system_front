angular.module('tagSystem').component("sourceTag",{
bindings:{
	id:"=",
	name:"=",
},
templateUrl:'app/modules/tagSystem/components/sourceTag/sourceTag.html?t='+Date.now(),
controller:["$scope","tagSystem",function($scope,tagSystem){
	
	
	$scope.sourceIdRelationTag=tagSystem.data.sourceIdRelationTag;
	
	var updateWebRelation=function(arg){
		arg.wid=tagSystem.data.wid;
		var post_data={
			func_name:"WebRelation::update",
			arg:arg,
		}
		tagSystem.post(post_data,function(res){
			console.log(res)
		})
	}
	var watch_sort;
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
					// console.log(id,res.list,$scope.list)
					resolve($scope.list);
					
				}else{
					$scope.list=[];
				}
				$scope.sourceIdRelationTag[id]=$scope.list;
				// console.log(res)
				watch_sort && watch_sort();
				watch_sort=$scope.$watch("list",function(nv,ov){
					if(nv.length==ov.length){
						for(var i in nv){
							if(nv[i]!=ov[i]){
								updateWebRelation({
									update:{sort_id:i},
									where:{
										tid:nv[i],
										source_id:$scope.$ctrl.id,
									}
								})
							}
						}
					}
				},1)
			});
		})
		
	}
	$scope.getTag=function(tid){
		var list=$scope.list;
		var source_id=$scope.$ctrl.id;
	
		var add={
			tid:tid,
			source_id:source_id,
		}
		tagSystem.addTag(add,list);
	}
	
	$scope.$ctrl.$onInit=function(){
		getWebRelation($scope.$ctrl.id)
		.then(function(tids){
			return tagSystem.getTagName(tids);
		})
	}
	$scope.editTag=function(id,name){
		tagSystem.data.control.edit.id=id;
		tagSystem.data.control.edit.name=name;
		tagSystem.data.control.edit.list=$scope.sourceIdRelationTag[id];
		tagSystem.data.control.mode=1
	}
}],
})
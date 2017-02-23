angular.module('tagSystem').component("searchTagElement",{
bindings:{
	data:"=",
},
templateUrl:'app/modules/tagSystem/components/searchTagElement/searchTagElement.html?t='+Date.now(),
controller:["$scope","tagSystem","$timeout",function($scope,tagSystem,$timeout){
	$scope.$ctrl.$onInit=function(){
		$scope.$watch("$ctrl.data",function(){
			$scope.$ctrl.data.required || ($scope.$ctrl.data.required=[])
			$scope.$ctrl.data.optional || ($scope.$ctrl.data.optional=[])
			$scope.$ctrl.data.tmp || ($scope.$ctrl.data.tmp=[])
			$scope.$ctrl.data.result || ($scope.$ctrl.data.result=[])
			$scope.$watch("$ctrl.data.required",watch,1);
			$scope.$watch("$ctrl.data.optional",watch,1);
		},1)
	}
	$scope.addSearch=function(tag_name){
		tagSystem.searchTid(tag_name,function(tid){
			tagSystem.addSearchTid(tid,0)
		})
	};
	var timer
	var watch=function(data){
		$timeout.cancel(timer);  
		timer=$timeout(function(){
			tagSystem.getTagName($scope.$ctrl.data.required);
			tagSystem.getTagName($scope.$ctrl.data.optional);
			tagSystem.getTagName($scope.$ctrl.data.tmp);
			// console.log('ggwp')
			var required=angular.copy($scope.$ctrl.data.required);
			var optional=angular.copy($scope.$ctrl.data.optional);
			
			if(required.length+optional.length){
				getWebRelationRecursive(1,optional,[],function(optional_result){
					// console.log('optional',$scope.$ctrl.data.optional,optional_result);
					if(required.length){
						getWebRelationRecursive(0,required,[],function(required_result){
							// console.log('required',required_result);
							if(optional_result.length){
									var tmp=[];
									for(var i in required_result){
										if(optional_result.indexOf(required_result[i])!=-1){
											tmp.push(required_result[i]);
										}
									}
									$scope.$ctrl.data.result=tmp;
								
							}else{
								$scope.$ctrl.data.result=required_result;
							}
							// console.log(tmp,required_result,optional_result)
						})
					}else{
						$scope.$ctrl.data.result=optional_result;
					}
				})
			}else{
				$scope.$ctrl.data.result=[];
			}
		},50)
	}
	
	
	$scope.tagName=tagSystem.data.tagName;
	
	var getWebRelationRecursive=function(type,required,source_ids,callback){
		if(!source_ids){
			source_ids=[];
		}
		var tid=required.pop();
			
		var where_list=[];
		where_list.push({field:'wid',type:0,value:tagSystem.data.wid})
		where_list.push({field:'tid',type:0,value:tid})
		
		for(var i in source_ids){
			where_list.push({field:'source_id',type:type,value:source_ids[i]})
		}
		
		var post_data={
			func_name:"WebRelation::getList",
			arg:{
				where_list:where_list,
				group_list:['source_id'],
			}
		}
		tagSystem.post(post_data,function(res){
			if(res.status){
				var tmp=res.list.map(function(val){
					return val.source_id;
				});
				
				if(type==0){
					source_ids=tmp
				}else if(type==1){
					source_ids=source_ids.concat(tmp);
				}
			}else{
				if(type==0){
					callback([]);
					return 
				}
			}
			if(required.length){
				getWebRelationRecursive(type,required,source_ids,callback);
			}else{
				callback(source_ids);
			}
			
		});
	}
	
}],
});
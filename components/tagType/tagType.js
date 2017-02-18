angular.module('tagSystem').component("tagType",{
bindings:{
},
templateUrl:'app/modules/tagSystem/components/tagType/tagType.html?t='+Date.now(),
controller:["$scope","tagSystem","$timeout",function($scope,tagSystem,$timeout){
	$scope.delWebTagType=function(index,list){
		var arg={};
		arg.tid=list.splice(index,1).pop()
		arg.wid=tagSystem.data.wid
		
		var post_data={
			func_name:"WebTagType::delete",
			arg:arg
		}
		tagSystem.post(post_data,function(res){
			console.log(res)
		});
	}
	$scope.addWebTagType=function(arg,list){
		if(list.indexOf(arg.tid)==-1){
			list.push(arg.tid)
		}
		arg.wid=tagSystem.data.wid
		arg.sort_id=list.length
		
		var post_data={
			func_name:"WebTagType::insert",
			arg:arg
		}
		tagSystem.post(post_data,function(res){
			console.log(res)
		});
	}
	var getWebTagType=function(){
		return new Promise(function(resolve,reject){
			var post_data={
				func_name:"WebTagType::getList",
				arg:{
					where_list:[
						{field:'wid',type:0,value:tagSystem.data.wid},
					],
					order_list:[
						{field:'sort_id',type:0},
					],
				}
			}
			tagSystem.post(post_data,function(res){
				if(res.status){
					$scope.select_arr=res.list.map(function(val){
						return val.tid;
					})
				}
				resolve();
			});
		})	
	}
	
	var getTagType=function(){
		return new Promise(function(resolve,reject){
			var where_list=[];
			
			var post_data={
				func_name:"TagType::getList",
				arg:{
					where_list:where_list,
				}
			}
			tagSystem.post(post_data,function(res){
				if(res.status){
					$scope.primary_data={};
					for(var i in res.list){
						var data=res.list[i];
						var id=data.id;
						$scope.primary_data[id]=data
					}
				}
				resolve();
			});
		})	
	}
	var timer;
	var process=function(){
		$timeout.cancel(timer)
		timer=$timeout(function(){
			$scope.not_select_arr=[];
			for(var id in $scope.primary_data){
				id*=1
				var index=$scope.select_arr.indexOf(id);
				if(index==-1){
					$scope.not_select_arr.push(id)
				}
			}
		},0)
	}
	
	
	$scope.$ctrl.$onInit=function(){
		getTagType()
		.then(function(){
			return getWebTagType();
		})
		.then(function(){
			$scope.$watch("primary_data",process,1)
			$scope.$watch("select_arr",process,1)
			$scope.$watch("select_arr",function(nv,ov){
				if(nv.length==ov.length){
					for(var i in nv){
						if(nv[i]!=ov[i]){
							var post_data={
								func_name:"WebTagType::update",
								arg:{
									where:{wid:tagSystem.data.wid,tid:nv[i]},
									update:{sort_id:i},
								}
							}
							tagSystem.post(post_data,function(res){
								console.log(res)
							});
						}
					}
				}
			},1)
		})
	}
	
}],
})

angular.module('tagSystem').component("tagType",{
bindings:{
	wid:"=",
},
templateUrl:'app/modules/tagSystem/components/tagType/tagType.html?t='+Date.now(),
controller:["$scope","tagSystem",function($scope,tagSystem){
	var getWebTagType=function(wid){
		return new Promise(function(resolve,reject){
			var post_data={
				func_name:"WebTagType::getList",
				arg:{
					where_list:[
						{field:'wid',type:0,value:tagSystem.data.wid},
					],
				}
			}
			tagSystem.post(post_data,function(res){
				if(res.status){
					res.list.sort(function(a,b){
						return a.sort_id-b.sort_id
					})
					var tids=res.list.map(function(val){
						return val.tid;
					})
					$scope.tids=tids
					resolve(tids);
				}
			});
		})	
	}
	var getTagType=function(tids){
		return new Promise(function(resolve,reject){
			var where_list=[];
			for(var i in tids){
				where_list.push({field:'id',type:0,value:tids[i]})
			}
			var post_data={
				func_name:"TagType::getList",
				arg:{
					where_list:where_list,
				}
			}
			tagSystem.post(post_data,function(res){
				if(res.status){
					var tnames={};
					for(var i in res.list){
						var data=res.list[i];
						var id=data.id;
						var name=data.name;
						tnames[id]=name;
					}
					$scope.tnames=tnames
					resolve(tnames);
				}
			});
		})	
	}
	$scope.$ctrl.$onInit=function(){
		getWebTagType($scope.$ctrl.wid)
		.then(function(tids){
			return getTagType(tids);
		})
		.then(function(tnames){
			// console.log(tnames)
		})
	}
}],
})

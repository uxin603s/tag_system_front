angular.module('tagSystem').component("tagType",{
bindings:{
	show:"=",
	getTag:"=",
},
templateUrl:'app/modules/tagSystem/components/tagType/tagType.html?t='+Date.now(),
controller:["$scope","$http","tagSystem","tagType",function($scope,$http,tagSystem,tagType){
	// console.log(tagType)
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
	
	$scope.$ctrl.$onInit=function(){
		$scope.tagSystem=tagSystem.data;
		$scope.tagType=tagType.data;
	}
	$scope.ch=function(control,item){
		// console.log(control,item)
		// return
		control.show=!control.show;
		$http.post('ajax.php',{
			func_name:"TagType::update",
			arg:{
				update:control.update,
				where:control.where,
			},
		})
		.success(function(res){
			if(res.status){
				for(var i in control.update){
					item[i]=control.update[i]
				}
			}
			console.log(res)
		})
	}
}],
});

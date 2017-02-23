angular.module('app').component("index",{
bindings:{},
templateUrl:'app/components/index/index.html?t='+Date.now(),
controller:['$scope','$http',
function($scope,$http){
	
	$scope.cache.mode || ($scope.cache.mode=0);
	$scope.mode_list=["選擇","編輯"];
	
	$scope.get=function(){
		$http.post('ajax.php',{
			func_name:"WebList::getList",
			arg:{},
		})
		.success(function(res){
			if(res.status){
				$scope.list=res.list;
			}else{
				$scope.list=[];
			}
			console.log(res)
		})
	}
	$scope.add=function(arg){
		if(!confirm("確認新增?")){
			return;
		}
		if(!arg.name){
			alert("請勿空白");
			return;
		}
		if(!$scope.list){
			alert("讀取資料中...")
			return
		}
		arg.sort_id=$scope.list.length
		$http.post('ajax.php',{
			func_name:"WebList::insert",
			arg:arg,
		})
		.success(function(res){
			if(res.status){
				$scope.list.push(res.insert);
				delete arg.name;
			}
			console.log(res)
		})
	}
	$scope.ch=function(control,item){
		if(!confirm("確認修改?")){
			return;
		}
		control.show=!control.show;
		$http.post('ajax.php',{
			func_name:"WebList::update",
			arg:{
				update:control.update,
				where:control.where,
			},
		})
		.success(function(res){
			if(res.status){
				item.name=control.update.name
			}
			console.log(res)
		})
	}
	$scope.get();

}],
})


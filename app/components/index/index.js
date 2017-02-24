angular.module('app').component("index",{
bindings:{},
templateUrl:'app/components/index/index.html?t='+Date.now(),
controller:['$scope','$http','tagSystem','tagType',
function($scope,$http,tagSystem,tagType){
	// tagType.getWebTagType(1);
	// tagSystem.data.tag_mode=1
	$scope.addTagType=function(arg){
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
			func_name:"TagType::insert",
			arg:arg,
		})
		.success(function(res){
			tagType.getTagType();
			console.log(res)
		})
	}
	$scope.cache.search || ($scope.cache.search={});
	$scope.cache.mode || ($scope.cache.mode=0);
	
	tagSystem.data.control.mode=3
	tagSystem.data.control.search.data=$scope.cache.search
	
	
	$scope.$watch("cache.mode",function(mode){
		tagSystem.data.tag_mode=mode;
		tagSystem.data.control.search.data=$scope.cache.search
	},1)
	
	$scope.mode_list=["選擇","編輯"];
	var watch
	$scope.get=function(){
		watch && watch();
		$http.post('ajax.php',{
			func_name:"WebList::getList",
			arg:{
				order_list:[{field:'sort_id',type:0}],
			},
		})
		.success(function(res){
			if(res.status){
				$scope.list=res.list;
			}else{
				$scope.list=[];
			}
			// console.log(res)
			watch=$scope.$watch("list",function(a,b){
				if(a.length==b.length){
					for(var i in a){
						if(a[i].id!=b[i].id){
							var control={
								update:{sort_id:i},
								where:{id:a[i].id}
							}
							
							$scope.ch(control,a);
						}
					}
				}
			},1)
		})
	}
	$scope.add=function(arg){
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
				for(var i in control.update){
					item[i]=control.update[i]
				}
			}
			console.log(res)
		})
	}
	$scope.del=function(index){
		var item=$scope.list.splice(index,1).pop();
		
		$http.post('ajax.php',{
			func_name:"WebList::delete",
			arg:{
				id:item.id,
			},
		})
		.success(function(res){
			console.log(res)
			if(!res.status){
				$scope.list.splice(index,0,item);
			}
			
		})
	}
	
	$scope.get();
}],
})


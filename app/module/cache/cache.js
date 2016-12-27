angular.module('cache',[])
.run(['$rootScope',function($rootScope){
	var cache={
		data:{
			not_finish_flag:true,
		}
	};
	
	localforage.getItem(location.pathname+"cache")
	.then(function(data){
		if(data){
			for(var i in data.data){
				cache.data[i]=data.data[i];
			}			
		}
		delete cache.data.not_finish_flag;
		$rootScope.$apply();
		$rootScope.$watch("cache",function(){
			localforage.setItem(location.pathname+"cache",angular.copy(cache));
		},1)
	});
	$rootScope.__proto__.cache=cache.data;
}])
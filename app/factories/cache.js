angular.module('app')
.factory('cache',['$rootScope',function($rootScope){
	var cache={
		data:{
			not_finish_flag:true,
		}
	};
	localforage.getItem(location.pathname+"cache")
	.then(function(data){
		if(data){
			if(data.cache_time && ((Math.floor(Date.now()/1000) - 1) > data.cache_time )){
				console.log("太久沒來了清除快取")
			}else{
				for(var i in data.data){
					cache.data[i]=data.data[i];
				}
				
			}
			delete cache.data.not_finish_flag;
			$rootScope.$apply();
		}
		// console.log(cache.data)
		setInterval(function(){
			cache.cache_time=Math.floor(Date.now()/1000);
			localforage.setItem(location.pathname+"cache",angular.copy(cache));
		},500)
	});
	return cache.data;
}])
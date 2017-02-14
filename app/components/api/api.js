angular.module('app').component("index",{
bindings:{},
templateUrl:'app/components/api/api.html?t='+Date.now(),
controller:['$scope',
function($scope){
	var time={}
	postMessageHelper.receive('tagSystem',function(res){
		clearTimeout(time[res.name])
		time[res.name]=setTimeout(function(){
			time[res.name]=setInterval(function(){
				clearTimeout(time[res.name])
				if(res.name=="post"){
					var request=res.value.request;
					var id=res.value.id;
					$.post("ajax.php",request,function(res){
						postMessageHelper
							.send("tagSystem",{name:'post',value:{id:id,value:res}})

					},"json")
				}
				$scope.$apply();
			},0)
		},0);
	});
}],
})
angular.module('app').component("api",{
bindings:{},
templateUrl:'app/components/api/api.html?t='+Date.now(),
controller:['$scope',
function($scope){	
	var time={}
	postMessageHelper.receive('tagSystem',function(res){
		if(res.name=="post"){
			
			var request=res.value.request;
			var id=res.value.id;
			$.post("ajax.php",request,function(res){
				// console.log("b",id,res)
				postMessageHelper
					.send("tagSystem",{name:'post',value:{id:id,value:res}})

			},"json")
		}
	});
}],
})